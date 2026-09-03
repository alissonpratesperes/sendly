import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { NoteModule } from './note/note.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { ContactModule } from './contact/contact.module';
import { TemplateModule } from './template/template.module';
import { SystemRootGuard } from './authentication/guards/systemRoot.guard';
import { AccessTokenGuard } from './authentication/guards/accessToken.guard';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    UserModule,
    ListModule,
    NoteModule,
    PrismaModule,
    CompanyModule,
    ContactModule,
    TemplateModule,
    AuthenticationModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: SystemRootGuard },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ]
})
export class AppModule {}
