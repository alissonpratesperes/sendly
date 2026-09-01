import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { ContactService } from './contact.service';
import { GetContactParamDto } from './dtos/getContactParam.dto';
import { ListContactQueryDto } from './dtos/listContactQuery.dto';
import { GetContactResponseDto } from './dtos/getContactResponse.dto';
import { ListContactResponseDto } from './dtos/listContactResponse.dto';
import { CreateContactCommandDto } from './dtos/createContactCommand.dto';
import { UpdateContactCommandDto } from './dtos/updateContactCommand.dto';

@Controller("contact")
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateContactCommandDto): Promise<GetContactResponseDto> {
        return this.contactService.create(command);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() params: GetContactParamDto): Promise<GetContactResponseDto> {
        return this.contactService.read(params);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: ListContactQueryDto): Promise<ListContactResponseDto> {
        return this.contactService.list(query);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    async update(@Param() params: GetContactParamDto, @Body() command: UpdateContactCommandDto): Promise<GetContactResponseDto> {
        return this.contactService.update(params, command);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() params: GetContactParamDto): Promise<void> {
        return this.contactService.delete(params);
    }
}
