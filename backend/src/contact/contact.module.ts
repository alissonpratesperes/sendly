import { Module } from '@nestjs/common';

import { ListModule } from '../list/list.module';
import { ContactService } from './contact.service';
import {CompanyModule} from '../company/company.module';
import { ContactController } from './contact.controller';

@Module({
  imports: [
    ListModule,
    CompanyModule,
  ],
  controllers: [
    ContactController,
  ],
  providers: [
    ContactService,
  ],
  exports: [
    ContactService,
  ],
})
export class ContactModule {}
