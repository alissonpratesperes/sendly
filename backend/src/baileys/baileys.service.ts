import pino from 'pino';
import * as fs from 'fs';
import * as path from 'path';
import { Boom } from '@hapi/boom';
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import makeWASocket, { DisconnectReason, proto, useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';

@Injectable()
export class BaileysService implements OnModuleDestroy {
    private sessions = new Map<number, Promise<WASocket>>();
    private readonly logger = new Logger(BaileysService.name);

    async getOrCreateSession(companyId: number, phoneNumberForPairing?: string): Promise<WASocket> {
        const existingSessionPromise = this.sessions.get(companyId);

        if (existingSessionPromise) {
            return existingSessionPromise;
        }

        const sessionPromise = this.initSession(companyId, phoneNumberForPairing);

        this.sessions.set(companyId, sessionPromise);

        return sessionPromise;
    }

    private async initSession(companyId: number, phoneNumberForPairing?: string): Promise<WASocket> {
        const sessionPath = path.resolve(process.cwd(), "sessions", `company_${companyId}`);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const socket = makeWASocket({ auth: state, printQRInTerminal: false, logger: pino({ level: "silent" }), });

        socket.ev.on("creds.update", saveCreds);

        if (!socket.authState.creds.registered && phoneNumberForPairing) {
            const cleanNumber = phoneNumberForPairing.replace(/\D/g, "");

            setTimeout(async () => {
                try {
                    const pairingCode = await socket.requestPairingCode(cleanNumber);

                    this.logger.log(`Successfully generated Pairing Code for Company: "${companyId}" - ${pairingCode}`);
                } catch (error) {
                    this.logger.error(`Error when generating Pairing Code for Company: "${companyId}"`, error);
                }
            }, 3000);
        }

        return new Promise((resolve, reject) => {
            let isResolved = false;

            socket.ev.on("connection.update", (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === "open") {
                    this.logger.log(`Successfully stablished connection for Company: "${companyId}"`);

                    if (!isResolved) {
                        isResolved = true;

                        resolve(socket);
                    }
                } else if (connection === "close") {
                    const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
                    const isLoggedOut = statusCode === DisconnectReason.loggedOut;
                    const isRestartRequired = statusCode === DisconnectReason.restartRequired || statusCode === 515;

                    this.logger.warn(`Finalized connection for Company: "${companyId}". Reason (statusCode): ${statusCode}`);

                    if (isLoggedOut) {
                        this.logger.error(`Company: "${companyId}" did log out. Cleaning stored credentials`);
                        this.sessions.delete(companyId);

                        fs.rmSync(sessionPath, { recursive: true, force: true });

                        if (!isResolved) {
                            isResolved = true;

                            reject(new Error(`Company: "${companyId}" logged out of WhatsApp`));
                        }
                    } else if (isRestartRequired) {
                        this.logger.log(`Rebooting post-pairing connection stream for Company: "${companyId}"`);
                        this.sessions.delete(companyId);

                        const reconnectPromise = this.initSession(companyId, phoneNumberForPairing);

                        this.sessions.set(companyId, reconnectPromise);

                        reconnectPromise.then(resolve).catch(reject);
                    } else {
                        this.sessions.delete(companyId);

                        if (!isResolved) {
                            isResolved = true;

                            reject(new Error(`Connection failed with WhatsApp for Company: "${companyId}"`));
                        }
                    }
                }
            });
        });
    }

    async sendMessage(companyId: number, to: string, text: string): Promise<proto.IWebMessageInfo> {
        const socket = await this.getOrCreateSession(companyId, to);

        if (!socket.user) {
            throw new Error(`Connection with WhatsApp for Company: "${companyId}" was not paired yet`);
        }

        const cleanNumber = to.replace(/\D/g, "");
        const results = await socket.onWhatsApp(cleanNumber);
        const result = results?.[0];

        if (!result || !result.exists) {
            throw new Error(`Number: "${cleanNumber}" does not have an active account in WhatsApp`);
        }

        const safeText = String(text ?? "");
        const response = await socket.sendMessage(result.jid, { text: safeText });

        if (!response) {
            throw new Error("Error when tryied to get a send confirmation response from Baileys");
        }

        return response;
    }

    async onModuleDestroy() {
        for (const [companyId, sessionPromise] of this.sessions.entries()) {
            try {
                const socket = await sessionPromise;

                socket.end(undefined);

                this.logger.log(`Session of Company: "${companyId}" was finalized`);
            } catch (error) {
                this.logger.error(`Error when finalizing session of Company: "${companyId}"`, error);
            }
        }

        this.sessions.clear();
    }
}