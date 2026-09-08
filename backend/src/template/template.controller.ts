import { ApiConsumes } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';

import { TemplateService } from './template.service';
import { IdParamDto } from '../common/dtos/idParam.dto';
import { GetTemplateResponseDto } from './dtos/getTemplateResponse.dto';
import { PaginationQueryDto } from '../common/dtos/paginationQuery.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { CreateTemplateCommandDto } from './dtos/createTemplateCommand.dto';
import { UpdateTemplateCommandDto } from './dtos/updateTemplateCommand.dto';
import { imageUrlToContent } from 'src/common/uploaders/imageToUrl.uploader';
import { TemplateImageInterceptor } from '../common/interceptors/templateImage.interceptor';

@Controller("template")
export class TemplateController {
    constructor(
        private readonly templateService: TemplateService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(TemplateImageInterceptor())
    async create(@UploadedFile() file: Express.Multer.File | undefined, @Body() command: CreateTemplateCommandDto): Promise<GetTemplateResponseDto> {
        return this.templateService.create(command.companyId, command.name, imageUrlToContent(command.content, file));
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() param: IdParamDto): Promise<GetTemplateResponseDto> {
        return this.templateService.read(param.id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<GetTemplateResponseDto>> {
        return this.templateService.list(query.page, query.limit, query.search);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(TemplateImageInterceptor())
    async update(@Param() param: IdParamDto, @UploadedFile() file: Express.Multer.File | undefined, @Body() command: UpdateTemplateCommandDto): Promise<GetTemplateResponseDto> {
        return this.templateService.update(param.id, command.companyId, command.name, imageUrlToContent(command.content, file));
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() param: IdParamDto): Promise<void> {
        return this.templateService.delete(param.id);
    }
}
