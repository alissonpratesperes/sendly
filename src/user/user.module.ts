import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CompanyService } from '../company/company.service';

@Module({
  providers: [UserService, CompanyService],
  controllers: [UserController]
})
export class UserModule {}
