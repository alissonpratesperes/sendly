import { PartialType } from '@nestjs/mapped-types';

import { CreateListCommandDto } from './createListCommand.dto';

export class UpdateListCommandDto extends PartialType(CreateListCommandDto) {}
