import { PartialType } from '@nestjs/mapped-types';

import { CreateNoteCommandDto } from './createNoteCommand.dto';

export class UpdateNoteCommandDto extends PartialType(CreateNoteCommandDto) {}
