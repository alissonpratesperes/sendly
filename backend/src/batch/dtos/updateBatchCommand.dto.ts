import { PartialType } from '@nestjs/mapped-types';

import { CreateBatchCommandDto } from './createBatchCommand.dto';

export class UpdateBatchCommandDto extends PartialType(CreateBatchCommandDto) {}
