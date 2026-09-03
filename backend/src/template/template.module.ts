import { Module } from '@nestjs/common';

import { TemplateService } from './template.service';
import { CompanyModule } from '../company/company.module';
import { TemplateController } from './template.controller';

@Module({
  imports: [
    CompanyModule,
  ],
  controllers: [
    TemplateController,
  ],
  providers: [
    TemplateService,
  ],
})
export class TemplateModule {}
