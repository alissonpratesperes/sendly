import pino from 'pino';
import * as path from 'path';
import { Boom } from '@hapi/boom';
import * as fs from 'fs/promises';
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import makeWASocket, { DisconnectReason, proto, useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';

import { TemplateService } from '../template/template.service';

@Injectable()
export class BaileysService implements OnModuleDestroy {
    constructor(
        private readonly templateService: TemplateService,
    ) {}

    private sessions = new Map<number, Promise<WASocket>>();
    private readonly logger = new Logger(BaileysService.name);

    private waitForConnection(companyId: number, sessionPath: string, socket: WASocket): Promise<WASocket> {
        return new Promise((resolve, reject) => {
            let isResolved = false;

            socket.ev.on("connection.update", async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === "open") {
                    this.logger.log(`Successfully established connection for Company: "${ companyId }"`);

                    if (!isResolved) {
                        isResolved = true;

                        resolve(socket);
                    }

                    return;
                }
                if (connection !== "close") {
                    return;
                }

                const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
                const isLoggedOut = statusCode === DisconnectReason.loggedOut;
                const isRestartRequired = statusCode === DisconnectReason.restartRequired || statusCode === 515;

                this.logger.warn(`Finalized connection for Company: "${ companyId }". Reason (statusCode): ${ statusCode }`);

                if (isLoggedOut) {
                    this.logger.error(`Company: "${ companyId }" logged out. Cleaning stored credentials`);
                    this.sessions.delete(companyId);

                    await fs.rm(sessionPath, { recursive: true, force: true, });

                    if (!isResolved) {
                        isResolved = true;

                        reject(new Error(`Company: "${ companyId }" logged out of WhatsApp`));
                    }

                    return;
                }
                if (isRestartRequired) {
                    this.logger.log(`Rebooting connection for Company: "${ companyId }"`);
                    this.sessions.delete(companyId);

                    const reconnectPromise = this.initSession(companyId);

                    this.sessions.set(companyId, reconnectPromise);

                    reconnectPromise.then(resolve).catch(reject);

                    return;
                }

                this.sessions.delete(companyId);

                if (!isResolved) {
                    isResolved = true;

                    reject(new Error(`Connection failed with WhatsApp for Company: "${ companyId }"`));
                }
            });
        });
    }

    private async createPairingSession(companyId: number, phoneNumber: string): Promise<{ socket: WASocket; pairingCode: string }> {
        const sessionPath = path.resolve(process.cwd(), "sessions", `company_${ companyId }`);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        if (state.creds.registered) {
            throw new Error(`Company "${ companyId }" already has a paired WhatsApp session`);
        }

        const cleanNumber = phoneNumber.replace(/\D/g, "");

        if (!cleanNumber) {
            throw new Error("Invalid phone number");
        }

        const socket = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: "silent" }),
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 60000,
        });

        socket.ev.on("creds.update", saveCreds);

        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Connection timeout when requesting paircode with WhatsApp"));
            }, 20000);
            const listener = (update: Partial<import("@whiskeysockets/baileys").ConnectionState>) => {
                const { connection, lastDisconnect, qr } = update;

                if (qr || connection === "connecting") {
                    setTimeout(() => {
                        clearTimeout(timeout);

                        socket.ev.off("connection.update", listener);

                        resolve();
                    }, 500);
                }
                if (connection === "close") {
                    clearTimeout(timeout);

                    socket.ev.off("connection.update", listener);

                    const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;

                    reject(new Error(`Connection closed before requesting the pairing code (status: ${ statusCode })`));
                }
            }

            socket.ev.on("connection.update", listener);
        });

        const pairingCode = await socket.requestPairingCode(cleanNumber);

        this.logger.log(`Successfully generated Pairing Code for Company: "${ companyId }" - ${ pairingCode }`);

        return {
            socket,
            pairingCode,
        };
    }

    async startPairing(companyId: number, phoneNumber: string): Promise<string> {
        if (this.sessions.has(companyId)) {
            throw new Error(`A WhatsApp session already exists for Company: "${ companyId }"`);
        }

        const { socket, pairingCode } = await this.createPairingSession(companyId, phoneNumber);
        const sessionPath = path.resolve(process.cwd(), "sessions", `company_${ companyId }`);
        const sessionPromise = this.waitForConnection(companyId, sessionPath, socket);

        this.sessions.set(companyId, sessionPromise);

        sessionPromise.catch(() => {
            if (this.sessions.get(companyId) === sessionPromise) {
                this.sessions.delete(companyId);
            }
        });

        return pairingCode;
    }

    async getOrCreateSession(companyId: number): Promise<WASocket> {
        const existingSessionPromise = this.sessions.get(companyId);

        if (existingSessionPromise) {
            return existingSessionPromise;
        }

        const sessionPromise = this.initSession(companyId);

        this.sessions.set(companyId, sessionPromise);

        sessionPromise.catch(() => {
            if (this.sessions.get(companyId) === sessionPromise) {
                this.sessions.delete(companyId);
            }
        });

        return sessionPromise;
    }

    private async initSession(companyId: number): Promise<WASocket> {
        const sessionPath = path.resolve(process.cwd(), "sessions", `company_${ companyId }`);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const socket = makeWASocket({ auth: state, printQRInTerminal: false, logger: pino({ level: "silent" }) });

        socket.ev.on("creds.update", saveCreds);

        return this.waitForConnection(companyId, sessionPath, socket);
    }

    private async getValidatedJid(companyId: number, to: string): Promise<{ socket: WASocket; jid: string }> {
        const socket = await this.getOrCreateSession(companyId);

        if (!socket.user) {
            throw new Error(`Connection with WhatsApp for Company: "${ companyId }" was not paired yet`);
        }

        const cleanNumber = to.replace(/\D/g, "");
        const results = await socket.onWhatsApp(cleanNumber);
        const result = results?.[0];

        if (!result || !result.exists) {
            throw new Error(`Number: "${cleanNumber}" does not have an active account in WhatsApp`);
        }

        return {
            socket,
            jid: result.jid,
        };
    }

    async sendMessage(companyId: number, to: string, text: string): Promise<proto.IWebMessageInfo> {
        const { socket, jid } = await this.getValidatedJid(companyId, to);
        const safeText = String(text ?? "");
        const response = await socket.sendMessage(jid, { text: safeText });

        if (!response) {
            throw new Error("Error when tryied to get a send confirmation response from Baileys");
        }

        return response;
    }

    async sendTemplateSingleMessage(companyId: number, to: string, content: string): Promise<proto.IWebMessageInfo> {
        const message = this.templateService.buildForSending(content);
        const { socket, jid } = await this.getValidatedJid(companyId, to);

        let response: proto.IWebMessageInfo | undefined;

        if (message.type === "image") {
            response = await socket.sendMessage(jid, {
                image: {
                    url: message.imagePath,
                },
                caption: message.text,
            });
        } else {
            response = await socket.sendMessage(jid, {
                text: message.text,
            });
        }
        if (!response) {
            throw new Error("Failed when tried to get Baileys confirmation response");
        }

        return response;
    }

    async logoutSession(companyId: number): Promise<void> {
        const sessionPath = path.resolve(process.cwd(), "sessions", `company_${ companyId }`);

        try {
            let socket: WASocket | undefined;

            if (this.sessions.has(companyId)) {
                socket = await this.sessions.get(companyId);
            } else {
                try {
                    socket = await this.initSession(companyId);
                } catch (err) {
                    this.logger.warn(`Was not possible establish connection for oficial logout of Company: "${ companyId }", forcing local cleanup`);
                }
            }
            if (socket && socket.user) {
                await socket.logout();

                this.logger.log(`Successfully logged out in WhatsApp servers for Company: "${ companyId }"`);
            }
        } catch (error) {
            this.logger.warn(`Fail to notificate logout in WhatsApp servers for Company: "${ companyId }"`);
        } finally {
            this.sessions.delete(companyId);

            try {
                await fs.rm(sessionPath, { recursive: true, force: true });

                this.logger.log(`Session local files deleted for Company: "${ companyId }"`);
            } catch (fsError) {
                this.logger.error(`Error when delete session folder of Company: "${ companyId }"`);
            }
        }
    }

    async getSessionStatus(companyId: number): Promise<{ connected: boolean; phone?: string }> {
        const sessionPromise = this.sessions.get(companyId);

        if (!sessionPromise) {
            return { connected: false };
        }

        try {
            const socket = await sessionPromise;

            if (socket && socket.user) {
                const cleanPhone = socket.user.id.split(':')[0] || socket.user.id.split("@")[0];

                return {
                    connected: true,
                    phone: cleanPhone,
                };
            }

            return { connected: false };
        } catch {
            return { connected: false };
        }
    }

    async onModuleDestroy() {
        for (const [companyId, sessionPromise] of this.sessions.entries()) {
            try {
                const socket = await sessionPromise;

                socket.end(undefined);

                this.logger.log(`Session of Company: "${ companyId }" was finalized`);
            } catch (error) {
                this.logger.error(`Error when finalizing session of Company: "${ companyId }"`);
            }
        }

        this.sessions.clear();
    }
}
