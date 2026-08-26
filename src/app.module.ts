import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { SystemRootGuard } from './authentication/guards/systemRoot.guard';
import { AccessTokenGuard } from './authentication/guards/accessToken.guard';
import { AuthenticationModule } from './authentication/authentication.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [PrismaModule, AuthenticationModule, CompanyModule],
  providers: [
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    { provide: APP_GUARD, useClass: SystemRootGuard }
  ]
})
export class AppModule {}
