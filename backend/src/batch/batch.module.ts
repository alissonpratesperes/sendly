import { Module } from '@nestjs/common';

import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { BatchSendService } from './batchSend.service';
import { CompanyModule } from '../company/company.module';
import { ContactModule } from '../contact/contact.module';
import { TemplateModule } from '../template/template.module';

@Module({
  imports: [
    CompanyModule,
    ContactModule,
    TemplateModule,
  ],
  controllers: [
    BatchController,
  ],
  providers: [
    BatchService,
    BatchSendService,
  ],
})
export class BatchModule {}
