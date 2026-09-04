import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { MailModule } from 'src/mail/mail.module';
import { UserController } from './user.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    MailModule,
    CompanyModule,
  ],
  providers: [
    UserService,
  ],
  controllers: [
    UserController,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {}
