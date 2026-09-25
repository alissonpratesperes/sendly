import { Module } from '@nestjs/common';

import { BaileysService } from './baileys.service';
import { BaileysController } from './baileys.controller';
import { TemplateModule } from 'src/template/template.module';
import { BaileysPairingService } from './baileysPairing.service';
import { BaileysSessionService } from './baileysSession.service';
import { BaileysMessagingService } from './baileysMessaging.service';

@Module({
    imports: [
        TemplateModule,
    ],
    controllers: [
        BaileysController,
    ],
    providers: [
        BaileysService,
        BaileysPairingService,
        BaileysSessionService,
        BaileysMessagingService,
    ],
    exports: [
        BaileysService,
    ],
})
export class BaileysModule {}
