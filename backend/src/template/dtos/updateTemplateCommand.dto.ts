import { PartialType } from '@nestjs/mapped-types';

import { CreateTemplateCommandDto } from './createTemplateCommand.dto';

export class UpdateTemplateCommandDto extends PartialType(CreateTemplateCommandDto) {}
