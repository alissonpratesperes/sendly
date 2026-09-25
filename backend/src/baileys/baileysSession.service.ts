import pino from 'pino';
import * as path from 'path';
import { Boom } from '@hapi/boom';
import * as fs from 'fs/promises';
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import makeWASocket, { DisconnectReason, useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';

@Injectable()
export class BaileysSessionService implements OnModuleDestroy {
    constructor() {}

    private sessions = new Map<number, Promise<WASocket>>();
    private readonly logger = new Logger(BaileysSessionService.name);

    private async initSession(companyId: number): Promise<WASocket> {
        const sessionPath = this.getSessionPath(companyId);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const socket = makeWASocket({ auth: state, printQRInTerminal: false, logger: pino({ level: "silent" }), });

        socket.ev.on("creds.update", saveCreds);

        return this.waitForConnection(companyId, sessionPath, socket);
    }

    private trackSession(companyId: number, sessionPromise: Promise<WASocket>): void {
        this.sessions.set(companyId, sessionPromise);

        sessionPromise.catch(() => {
            if (this.sessions.get(companyId) === sessionPromise) {
                this.sessions.delete(companyId);
            }
        });
    }

    private async waitForConnection(companyId: number, sessionPath: string, socket: WASocket): Promise<WASocket> {
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

                    this.trackSession(companyId, reconnectPromise);

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

    registerSession(companyId: number, socket: WASocket): void {
        const sessionPath = this.getSessionPath(companyId);
        const sessionPromise = this.waitForConnection(companyId, sessionPath, socket);

        this.trackSession(companyId, sessionPromise);
    }

    getSessionPath(companyId: number): string {
        return path.resolve(process.cwd(), "sessions", `company_${ companyId }`);
    }

    async getExistingSession(companyId: number): Promise<WASocket | null> {
        const existingSession = this.sessions.get(companyId);

        if (existingSession) {
            try {
                return await existingSession;
            } catch {
                if (this.sessions.get(companyId) === existingSession) {
                    this.sessions.delete(companyId);
                }
            }
        }
        if (!(await this.hasPersistedSession(companyId))) {
            return null;
        }

        try {
            return await this.getOrCreateSession(companyId);
        } catch {
            return null;
        }
    }

    async hasPersistedSession(companyId: number): Promise<boolean> {
        try {
            const { state } = await useMultiFileAuthState(this.getSessionPath(companyId));

            return state.creds.registered;
        } catch {
            return false;
        }
    }

    async getOrCreateSession(companyId: number): Promise<WASocket> {
        const existingSessionPromise = this.sessions.get(companyId);

        if (existingSessionPromise) {
            return existingSessionPromise;
        }

        const sessionPromise = this.initSession(companyId);

        this.trackSession(companyId, sessionPromise);

        return sessionPromise;
    }

    async status(companyId: number): Promise<{ connected: boolean; phone?: string }> {
        const existingSession = this.sessions.get(companyId);

        if (!existingSession && !(await this.hasPersistedSession(companyId))) {
            return {
                connected: false,
            };
        }

        try {
            const socket = await this.getOrCreateSession(companyId);

            if (!socket.user) {
                return {
                    connected: false,
                };
            }

            const cleanPhone = socket.user.id.split(":")[0] || socket.user.id.split("@")[0];

            return {
                connected: true,
                phone: cleanPhone,
            };
        } catch (error) {
            this.logger.warn(
                `Could not restore WhatsApp session for Company "${ companyId }": ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );

            return {
                connected: false,
            };
        }
    }

    async logout(companyId: number): Promise<void> {
        const sessionPath = this.getSessionPath(companyId);

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
