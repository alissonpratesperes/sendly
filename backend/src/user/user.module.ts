import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { MailModule } from '../mail/mail.module';
import { UserController } from './user.controller';
import { TokenModule } from '../token/token.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    MailModule,
    TokenModule,
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
