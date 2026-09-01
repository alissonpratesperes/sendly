import { Module } from '@nestjs/common';

import { ContactService } from './contact.service';
import { ListService } from '../list/list.service';
import { ContactController } from './contact.controller';
import { CompanyService } from '../company/company.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, ListService, CompanyService],
  exports: [ContactService],
})
export class ContactModule {}
