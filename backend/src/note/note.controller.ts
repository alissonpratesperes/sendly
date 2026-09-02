import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { NoteService } from './note.service';
import { IdParamDto } from '../common/dtos/idParam.dto';
import { GetNoteResponseDto } from './dtos/getNoteResponse.dto';
import { CreateNoteCommandDto } from './dtos/createNoteCommand.dto';
import { UpdateNoteCommandDto } from './dtos/updateNoteCommand.dto';
import { PaginationQueryDto } from '../common/dtos/paginationQuery.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';

@Controller("note")
export class NoteController {
    constructor(
        private readonly noteService: NoteService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateNoteCommandDto): Promise<GetNoteResponseDto> {
        return this.noteService.create(command.contactId, command.content);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() param: IdParamDto): Promise<GetNoteResponseDto> {
        return this.noteService.read(param.id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<GetNoteResponseDto>> {
        return this.noteService.list(query.page, query.limit, query.search);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    async update(@Param() param: IdParamDto, @Body() command: UpdateNoteCommandDto): Promise<GetNoteResponseDto> {
        return this.noteService.update(param.id, command.contactId, command.content);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() param: IdParamDto): Promise<void> {
        return this.noteService.delete(param.id);
    }
}
