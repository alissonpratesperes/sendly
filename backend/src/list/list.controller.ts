import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { ListService } from './list.service';
import { GetListParamDto } from './dtos/getListParam.dto';
import { ListListQueryDto } from './dtos/listListQuery.dto';
import { GetListResponseDto } from './dtos/getListResponse.dto';
import { ListListResponseDto } from './dtos/listListResponse.dto';
import { CreateListCommandDto } from './dtos/createListCommand.dto';
import { UpdateListCommandDto } from './dtos/updateListCommand.dto';

@Controller("list")
export class ListController {
    constructor(private readonly listService: ListService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateListCommandDto): Promise<GetListResponseDto> {
        return this.listService.create(command);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() params: GetListParamDto): Promise<GetListResponseDto> {
        return this.listService.read(params);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: ListListQueryDto): Promise<ListListResponseDto> {
        return this.listService.list(query);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    async update(@Param() params: GetListParamDto, @Body() command: UpdateListCommandDto): Promise<GetListResponseDto> {
        return this.listService.update(params, command);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() params: GetListParamDto): Promise<void> {
        return this.listService.delete(params);
    }
}
