import { PartialType } from '@nestjs/mapped-types';

import { CreateUserCommandDto } from './createUserCommand.dto';

export class UpdateUserCommandDto extends PartialType(CreateUserCommandDto) {}
