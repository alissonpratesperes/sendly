import { ClsModule } from 'nestjs-cls';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { NoteModule } from './note/note.module';
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
import { CompanyContextInterceptor } from './common/interceptors/companyContext.interceptor';

@Module({
  imports: [
    ClsModule.forRoot({ global: true, middleware: { mount: true }, }),

    MailModule,
    UserModule,
    ListModule,
    NoteModule,
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
    { provide: APP_INTERCEPTOR, useClass: CompanyContextInterceptor, },
  ],
})
export class AppModule {}
