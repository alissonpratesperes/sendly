import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { NoteService } from './note.service';
import { GetNoteParamDto } from './dtos/getNoteParam.dto';
import { ListNoteQueryDto } from './dtos/listNoteQuery.dto';
import { GetNoteResponseDto } from './dtos/getNoteResponse.dto';
import { ListNoteResponseDto } from './dtos/listNoteResponse.dto';
import { CreateNoteCommandDto } from './dtos/createNoteCommand.dto';
import { UpdateNoteCommandDto } from './dtos/updateNoteCommand.dto';

@Controller("note")
export class NoteController {
    constructor(private readonly noteService: NoteService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateNoteCommandDto): Promise<GetNoteResponseDto> {
        return this.noteService.create(command);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() params: GetNoteParamDto): Promise<GetNoteResponseDto> {
        return this.noteService.read(params);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: ListNoteQueryDto): Promise<ListNoteResponseDto> {
        return this.noteService.list(query);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    async update(@Param() params: GetNoteParamDto, @Body() command: UpdateNoteCommandDto): Promise<GetNoteResponseDto> {
        return this.noteService.update(params, command);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() params: GetNoteParamDto): Promise<void> {
        return this.noteService.delete(params);
    }
}
