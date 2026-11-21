import { Module } from '@nestjs/common';

import { BatchService } from './batch.service';
import { QueueModule } from '../queue/queue.module';
import { BatchController } from './batch.controller';
import { BatchSendService } from './batchSend.service';
import { CompanyModule } from '../company/company.module';
import { ContactModule } from '../contact/contact.module';
import { BaileysModule } from '../baileys/baileys.module';
import { TemplateModule } from '../template/template.module';
import { BatchSendProcessor } from './processors/batchSend.processor';
import { BatchSendSchedulerService } from './batchSendScheduler.service';

@Module({
  imports: [
    QueueModule,
    CompanyModule,
    ContactModule,
    BaileysModule,
    TemplateModule,
  ],
  controllers: [
    BatchController,
  ],
  providers: [
    BatchService,
    BatchSendService,
    BatchSendProcessor,
    BatchSendSchedulerService,
  ],
})
export class BatchModule {}
