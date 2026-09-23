import { ApiConsumes } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';

import { TemplateService } from './template.service';
import { IdParamDto } from '../common/dtos/idParam.dto';
import { TemplateParser } from './parsers/templateParser.parser';
import { ParsedTemplate } from './interfaces/parsedTemplate.interface';
import { GetTemplateResponseDto } from './dtos/getTemplateResponse.dto';
import { PaginationQueryDto } from '../common/dtos/paginationQuery.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { CreateTemplateCommandDto } from './dtos/createTemplateCommand.dto';
import { UpdateTemplateCommandDto } from './dtos/updateTemplateCommand.dto';
import { imagePathToContent } from './uploaders/imagePathToContent.uploader';
import { TemplateImageInterceptor } from './interceptors/templateImage.interceptor';

@Controller("template")
export class TemplateController {
    constructor(
        private readonly templateParser: TemplateParser,
        private readonly templateService: TemplateService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(TemplateImageInterceptor())
    async create(@UploadedFile() image: Express.Multer.File | undefined, @Body() command: CreateTemplateCommandDto): Promise<GetTemplateResponseDto> {
        const parsedContent = this.templateParser.parse(command.content);
        const content = await imagePathToContent(parsedContent, image);

        return this.templateService.create(command.companyId, command.name, content);
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
    async update(@Param() param: IdParamDto, @UploadedFile() image: Express.Multer.File | undefined, @Body() command: UpdateTemplateCommandDto): Promise<GetTemplateResponseDto> {
        if (image && command.content === undefined) {
            throw new BadRequestException("Template content is required when uploading an image");
        }

        let content: ParsedTemplate | undefined;

        if (command.content !== undefined) {
            const parsedContent = this.templateParser.parse(command.content);

            content = await imagePathToContent(parsedContent, image);
        }

        return this.templateService.update(param.id, command.companyId, command.name, content);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() param: IdParamDto): Promise<void> {
        return this.templateService.delete(param.id);
    }
}
