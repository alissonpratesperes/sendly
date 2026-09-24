import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { TemplateService } from './template.service';
import { CompanyModule } from '../company/company.module';
import { TemplateController } from './template.controller';
import { TemplateParser } from './parsers/templateParser.parser';
import { TemplateBuilder } from './builders/templateBuilder.builder';
import { TemplateInterpolator } from './interpolators/templateInterpolator.interpolator';

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

    TemplateParser,
    TemplateBuilder,
    TemplateInterpolator,
  ],
  exports: [
    TemplateService,
    TemplateInterpolator,
  ],
})
export class TemplateModule {}
