import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { AccessTokenGuard } from './authentication/guards/accessToken.guard';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [PrismaModule, AuthenticationModule],
  providers: [{ provide: APP_GUARD, useValue: new AccessTokenGuard(new Reflector()) }]
})
export class AppModule {}
