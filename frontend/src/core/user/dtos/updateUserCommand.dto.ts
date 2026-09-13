import { CreateUserCommandDto } from './createUserCommand.dto';

export interface UpdateUserCommandDto extends Partial<CreateUserCommandDto> { }
