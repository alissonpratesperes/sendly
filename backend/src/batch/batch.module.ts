import { Module } from '@nestjs/common';

import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { BatchSendService } from './batchSend.service';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    CompanyModule,
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
