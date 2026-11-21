import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';

import { BatchService } from './batch.service';
import { BatchSendService } from './batchSend.service';
import { IdParamDto } from '../common/dtos/idParam.dto';
import { GetBatchResponseDto } from './dtos/getBatchResponse.dto';
import { CreateBatchCommandDto } from './dtos/createBatchCommand.dto';
import { PaginationQueryDto } from '../common/dtos/paginationQuery.dto';
import { GetBatchSendResponseDto } from './dtos/getBatchSendResponseDto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { BatchesRankingResponseDto } from './dtos/batchesRankingResponse.dto';
import { BatchSendsRankingResponseDto } from './dtos/batchSendsRankingResponse.dto';

@Controller("batch")
export class BatchController {
    constructor(
        private readonly batchService: BatchService,
        private readonly batchSendService: BatchSendService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateBatchCommandDto): Promise<GetBatchResponseDto> {
        return this.batchService.create(command.companyId, command.name, command.templateId, command.listId);
    }

    @Get("chart/batches-ranking")
    @HttpCode(HttpStatus.OK)
    async getBatchesRanking(): Promise<BatchesRankingResponseDto> {
        return this.batchService.rank();
    }

    @Get(":id/chart/batch-sends-ranking")
    @HttpCode(HttpStatus.OK)
    async getBatchSendsRanking(@Param() param: IdParamDto): Promise<BatchSendsRankingResponseDto> {
        return this.batchSendService.rank(param.id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<GetBatchResponseDto>> {
        return this.batchService.list(query.page, query.limit, query.search, query.situation, query.templateId);
    }

    @Get(":id/sends")
    @HttpCode(HttpStatus.OK)
    async listSends(@Param() param: IdParamDto, @Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<GetBatchSendResponseDto>> {
        return this.batchService.listSends(param.id, query.page, query.limit, query.status);
    }
}
