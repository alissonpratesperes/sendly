import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { ContactModule } from './contact/contact.module';
import { SystemRootGuard } from './authentication/guards/systemRoot.guard';
import { AccessTokenGuard } from './authentication/guards/accessToken.guard';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    UserModule,
    ListModule,
    PrismaModule,
    CompanyModule,
    ContactModule,
    AuthenticationModule,
    ],
  providers: [
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    { provide: APP_GUARD, useClass: SystemRootGuard }
  ]
})
export class AppModule {}
