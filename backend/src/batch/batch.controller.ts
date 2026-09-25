import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { BatchService } from './batch.service';
import { IdParamDto } from '../common/dtos/idParam.dto';
import { GetBatchResponseDto } from './dtos/getBatchResponse.dto';
import { CreateBatchCommandDto } from './dtos/createBatchCommand.dto';
import { UpdateBatchCommandDto } from './dtos/updateBatchCommand.dto';
import { PaginationQueryDto } from '../common/dtos/paginationQuery.dto';
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

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() param: IdParamDto): Promise<GetBatchResponseDto> {
        return this.batchService.read(param.id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<GetBatchResponseDto>> {
        return this.batchService.list(query.page, query.limit, query.search);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    async update(@Param() param: IdParamDto, @Body() command: UpdateBatchCommandDto): Promise<GetBatchResponseDto> {
        return this.batchService.update(param.id, command.name, command.templateId, command.listId);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() param: IdParamDto): Promise<void> {
        return this.batchService.delete(param.id);
    }
}
