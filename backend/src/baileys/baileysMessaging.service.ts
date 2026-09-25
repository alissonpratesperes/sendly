import { Injectable } from '@nestjs/common';
import { proto, WASocket } from '@whiskeysockets/baileys';

import { TemplateService } from '../template/template.service';
import { BaileysSessionService } from './baileysSession.service';

@Injectable()
export class BaileysMessagingService {
    constructor(
        private readonly templateService: TemplateService,
        private readonly baileysSessionService: BaileysSessionService,
    ) {}

    private async getValidatedJid(companyId: number, to: string): Promise<{ socket: WASocket; jid: string }> {
        const socket = await this.baileysSessionService.getOrCreateSession(companyId);

        if (!socket.user) {
            throw new Error(`Connection with WhatsApp for Company: "${ companyId }" was not paired yet`);
        }

        const cleanNumber = to.replace(/\D/g, "");
        const results = await socket.onWhatsApp(cleanNumber);
        const result = results?.[0];

        if (!result || !result.exists) {
            throw new Error(`Number: "${ cleanNumber }" does not have an active account in WhatsApp`);
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
}
