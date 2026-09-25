import pino from 'pino';
import { Boom } from '@hapi/boom';
import { Injectable, Logger } from '@nestjs/common';
import makeWASocket, { useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';

import { BaileysSessionService } from './baileysSession.service';

@Injectable()
export class BaileysPairingService {
    constructor(
        private readonly baileysSessionService: BaileysSessionService,
    ) {}

    private readonly logger = new Logger(BaileysPairingService.name);

    private async createPairingSession(companyId: number, phoneNumber: string): Promise<{ socket: WASocket; pairingCode: string }> {
        const sessionPath = this.baileysSessionService.getSessionPath(companyId);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
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

    async pair(companyId: number, phoneNumber: string): Promise<string> {
        const existingSession = await this.baileysSessionService.getExistingSession(companyId);

        if (existingSession?.user) {
            throw new Error(`Company "${ companyId }" already has a connected WhatsApp session`);
        }

        const hasPersistedSession = await this.baileysSessionService.hasPersistedSession(companyId);

        if (hasPersistedSession) {
                throw new Error(
                `Company "${ companyId }" has persisted WhatsApp credentials, ` +
                `but the session could not be restored. ` +
                `Logout/cleanup is required before pairing again`,
            );
        }

        const { socket, pairingCode } = await this.createPairingSession(companyId, phoneNumber);

        this.baileysSessionService.registerSession(companyId, socket);

        return pairingCode;
    }
}
