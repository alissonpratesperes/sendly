import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';

import { BatchService } from './batch.service';
import { IdParamDto } from 'src/common/dtos/idParam.dto';
import { GetBatchResponseDto } from './dtos/getBatchResponse.dto';
import { CreateBatchCommandDto } from './dtos/createBatchCommand.dto';
import { PaginationQueryDto } from '../common/dtos/paginationQuery.dto';
import { GetBatchSendResponseDto } from './dtos/getBatchSendResponseDto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';

@Controller("batch")
export class BatchController {
    constructor(
        private readonly batchService: BatchService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateBatchCommandDto): Promise<GetBatchResponseDto> {
        return this.batchService.create(command.companyId, command.name, command.templateId, command.listId);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<GetBatchResponseDto>> {
        return this.batchService.list(query.page, query.limit, query.search);
    }

    @Get(":id/sends")
    @HttpCode(HttpStatus.OK)
    async listSends(@Param() param: IdParamDto): Promise<GetBatchSendResponseDto[]> {
        return this.batchService.listSends(param.id);
    }
}
