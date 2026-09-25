import { Injectable } from '@nestjs/common';
import { proto } from '@whiskeysockets/baileys';

import { BaileysPairingService } from './baileysPairing.service';
import { BaileysSessionService } from './baileysSession.service';
import { BaileysMessagingService } from './baileysMessaging.service';

@Injectable()
export class BaileysService {
    constructor(
        private readonly baileysPairingService: BaileysPairingService,
        private readonly baileysSessionService: BaileysSessionService,
        private readonly baileysMessagingService: BaileysMessagingService,
    ) {}

    async pair(companyId: number, phoneNumber: string): Promise<string> {
        return this.baileysPairingService.pair(companyId, phoneNumber);
    }

    async sendMessage(companyId: number, to: string, text: string): Promise<proto.IWebMessageInfo> {
        return this.baileysMessagingService.sendMessage(companyId, to, text);
    }

    async sendTemplateSingleMessage(companyId: number, to: string, content: string): Promise<proto.IWebMessageInfo> {
        return this.baileysMessagingService.sendTemplateSingleMessage(companyId, to, content);
    }

    async status(companyId: number): Promise<{ connected: boolean; phone?: string }> {
        return this.baileysSessionService.status(companyId);
    }

    async logout(companyId: number): Promise<void> {
        return this.baileysSessionService.logout(companyId);
    }
}
