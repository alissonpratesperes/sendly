import { Note } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { GetNoteParamDto } from './dtos/getNoteParam.dto';
import { ListNoteQueryDto } from './dtos/listNoteQuery.dto';
import { ContactService } from 'src/contact/contact.service';
import { GetNoteResponseDto } from './dtos/getNoteResponse.dto';
import { ListNoteResponseDto } from './dtos/listNoteResponse.dto';
import { CreateNoteCommandDto } from './dtos/createNoteCommand.dto';
import { UpdateNoteCommandDto } from './dtos/updateNoteCommand.dto';

@Injectable()
export class NoteService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly contactService: ContactService,
    ) {}

    private toNoteResponse(note: Note): GetNoteResponseDto {
        return new GetNoteResponseDto(
            note.Id,
            note.ContactId,

            note.Content,

            note.CreatedAt,
            note.UpdatedAt,
        );
    }

    private buildNoteListWhere(query: ListNoteQueryDto) {
        return {
            DeletedAt: null,
            ...(query.search
                ? {
                    OR: [
                        { Content: { contains: query.search } },
                    ],
                }
            : {}),
        };
    }

    async create(command: CreateNoteCommandDto): Promise<GetNoteResponseDto> {
        await this.contactService.read({ id: command.contactId });

        const createdNote = await this.prismaService.note.create({
            data: {
                ContactId: command.contactId,
                Content: command.content,
            },
        });

        return this.toNoteResponse(createdNote);
    }

    async read(params: GetNoteParamDto): Promise<GetNoteResponseDto> {
        const note = await this.prismaService.note.findFirst({
            where: {
                Id: params.id,
                DeletedAt: null,
            },
        });

        if(!note) {
            throw new NotFoundException("Note not found");
        }

        return this.toNoteResponse(note);
    }

    async list(query: ListNoteQueryDto): Promise<ListNoteResponseDto> {
        const skip = (query.page - 1) * query.limit;
        const where = this.buildNoteListWhere(query);

        const [total, notes] = await Promise.all([
            this.prismaService.note.count({
                where,
            }),
            this.prismaService.note.findMany({
                where,
                skip,
                take: query.limit,
                orderBy: {
                    CreatedAt: "desc",
                },
            }),
        ]);

        const totalPages = Math.ceil(total / query.limit);
        const hasNextPage = query.page < totalPages;
        const hasPreviousPage = query.page > 1;
        const data = notes.map((note) => this.toNoteResponse(note));

        return new ListNoteResponseDto(
            query.page,
            query.limit,
            total,

            totalPages,
            hasNextPage,
            hasPreviousPage,

            data,
        );
    }

    async update(params: GetNoteParamDto, command: UpdateNoteCommandDto): Promise<GetNoteResponseDto> {
        const note = await this.read(params);

        if (command.contactId !== undefined) {
            await this.contactService.read({
                id: command.contactId,
            });
        }

        const updatedNote = await this.prismaService.note.update({
            where: {
                Id: note.id,
            },
            data: {
                ...(command.contactId !== undefined && {
                    ContactId: command.contactId,
                }),
                ...(command.content !== undefined && {
                    Content: command.content,
                }),
            },
        });

        return this.toNoteResponse(updatedNote);
    }

    async delete(params: GetNoteParamDto): Promise<void> {
        const note = await this.read(params);

        await this.prismaService.note.update({
            where: {
                Id: note.id,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
