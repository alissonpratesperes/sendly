import { join } from 'path';
import { ClsModule } from 'nestjs-cls';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { BatchModule } from './batch/batch.module';
import { TokenModule } from './token/token.module';
import { QueueModule } from './queue/queue.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { ContactModule } from './contact/contact.module';
import { BaileysModule } from './baileys/baileys.module';
import { TemplateModule } from './template/template.module';
import { SystemRootGuard } from './authentication/guards/systemRoot.guard';
import { AccessTokenGuard } from './authentication/guards/accessToken.guard';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    ClsModule.forRoot({ global: true, middleware: { mount: true }, }),
    ServeStaticModule.forRoot({ rootPath: join(process.cwd(), "uploads"), serveRoot: "/uploads", }),

    MailModule,
    UserModule,
    ListModule,
    BatchModule,
    TokenModule,
    QueueModule,
    PrismaModule,
    CompanyModule,
    ContactModule,
    BaileysModule,
    TemplateModule,
    AuthenticationModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AccessTokenGuard, },
    { provide: APP_GUARD, useClass: SystemRootGuard, },
  ],
})
export class AppModule {}
