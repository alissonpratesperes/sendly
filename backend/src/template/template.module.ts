import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { TemplateService } from './template.service';
import { CompanyModule } from '../company/company.module';
import { TemplateController } from './template.controller';

@Module({
  imports: [
    MulterModule.register({ dest: "./uploads", }),

    CompanyModule,
  ],
  controllers: [
    TemplateController,
  ],
  providers: [
    TemplateService,
  ],
  exports: [
    TemplateService,
  ],
})
export class TemplateModule {}
