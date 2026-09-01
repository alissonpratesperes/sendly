import { PartialType } from '@nestjs/mapped-types';

import { CreateContactCommandDto } from './createContactCommand.dto';

export class UpdateContactCommandDto extends PartialType(CreateContactCommandDto) {}
