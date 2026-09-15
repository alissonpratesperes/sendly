import { CreateContactCommandDto } from './createContactCommand.dto';

export interface UpdateContactCommandDto extends Partial<CreateContactCommandDto> { }
