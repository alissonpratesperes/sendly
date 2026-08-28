import { Module } from '@nestjs/common';

import { ListService } from './list.service';
import { ListController } from './list.controller';
import { CompanyService } from '../company/company.service';

@Module({
  providers: [ListService, CompanyService],
  controllers: [ListController]
})
export class ListModule {}
