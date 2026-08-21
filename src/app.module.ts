import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [PrismaModule, AuthenticationModule],
})
export class AppModule {}
