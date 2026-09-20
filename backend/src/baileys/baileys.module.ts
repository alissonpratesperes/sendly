import { Module } from '@nestjs/common';

import { BaileysService } from './baileys.service';
import { BaileysController } from './baileys.controller';
import { TemplateModule } from 'src/template/template.module';

@Module({
    imports: [
        TemplateModule,
    ],
    controllers: [
        BaileysController,
    ],
    providers: [
        BaileysService,
    ],
    exports: [
        BaileysService,
    ],
})
export class BaileysModule {}
