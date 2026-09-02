import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { ListService } from './list.service';
import { IdParamDto } from '../common/dtos/idParam.dto';
import { GetListResponseDto } from './dtos/getListResponse.dto';
import { CreateListCommandDto } from './dtos/createListCommand.dto';
import { UpdateListCommandDto } from './dtos/updateListCommand.dto';
import { PaginationQueryDto } from '../common/dtos/paginationQuery.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';

@Controller("list")
export class ListController {
    constructor(
        private readonly listService: ListService
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateListCommandDto): Promise<GetListResponseDto> {
        return this.listService.create(command.companyId, command.name, command.subject, command.color);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() param: IdParamDto): Promise<GetListResponseDto> {
        return this.listService.read(param.id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<GetListResponseDto>> {
        return this.listService.list(query.page, query.limit, query.search);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    async update(@Param() param: IdParamDto, @Body() command: UpdateListCommandDto): Promise<GetListResponseDto> {
        return this.listService.update(param.id, command.companyId, command.name, command.subject, command.color);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() param: IdParamDto): Promise<void> {
        return this.listService.delete(param.id);
    }
}
