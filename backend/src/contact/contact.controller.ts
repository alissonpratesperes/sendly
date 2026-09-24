import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';

import { ContactService } from './contact.service';
import { IdParamDto } from '../common/dtos/idParam.dto';
import { GetContactResponseDto } from './dtos/getContactResponse.dto';
import { PaginationQueryDto } from '../common/dtos/paginationQuery.dto';
import { CreateContactCommandDto } from './dtos/createContactCommand.dto';
import { UpdateContactCommandDto } from './dtos/updateContactCommand.dto';
import { ImportContactCommandDto } from './dtos/importContactCommand.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { ImportContactResponseDto } from './dtos/importContactResponse.dto';

@Controller("contact")
export class ContactController {
    constructor(
        private readonly contactService: ContactService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateContactCommandDto): Promise<GetContactResponseDto> {
        return this.contactService.create(command.companyId, command.listId, command.name, command.phone, command.country);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() param: IdParamDto): Promise<GetContactResponseDto> {
        return this.contactService.read(param.id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<GetContactResponseDto>> {
        return this.contactService.list(query.page, query.limit, query.search);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    async update(@Param() param: IdParamDto, @Body() command: UpdateContactCommandDto): Promise<GetContactResponseDto> {
        return this.contactService.update(param.id, command.companyId, command.listId, command.name, command.phone, command.country, command.active);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() param: IdParamDto): Promise<void> {
        return this.contactService.delete(param.id);
    }

    @Post("import")
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor("file"))
    async import(@Body() command: ImportContactCommandDto, @UploadedFile() file: Express.Multer.File): Promise<ImportContactResponseDto> {
        return this.contactService.import(command.listId, file);
    }
}
