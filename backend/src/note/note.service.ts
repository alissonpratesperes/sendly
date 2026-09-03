import { Note, Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ContactService } from 'src/contact/contact.service';
import { GetNoteResponseDto } from './dtos/getNoteResponse.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';

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

    private buildNoteListWhere(search?: string): Prisma.NoteWhereInput {
        return {
            DeletedAt: null,
            ...(search
                ? {
                    OR: [
                        { Content: { contains: search } },
                    ],
                }
            : {}),

            Contact: {
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
                List: {
                    DeletedAt: null,

                    Company: {
                        DeletedAt: null,
                    },
                },
            },
        };
    }

    async create(contactId: number, content: string): Promise<GetNoteResponseDto> {
        await this.contactService.read(contactId);

        const createdNote = await this.prismaService.note.create({
            data: {
                ContactId: contactId,
                Content: content,
            },
        });

        return this.toNoteResponse(createdNote);
    }

    async read(id: number): Promise<GetNoteResponseDto> {
        const note = await this.prismaService.note.findFirst({
            where: {
                Id: id,
                DeletedAt: null,

                Contact: {
                    DeletedAt: null,

                    Company: {
                        DeletedAt: null,
                    },
                    List: {
                        DeletedAt: null,

                        Company: {
                            DeletedAt: null,
                        },
                    },
                },
            },
        });

        if(!note) {
            throw new NotFoundException("Note not found");
        }

        return this.toNoteResponse(note);
    }

    async list(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponseDto<GetNoteResponseDto>> {
        const where = this.buildNoteListWhere(search);
        const [total, notes] = await Promise.all([
            this.prismaService.note.count({
                where,
            }),
            this.prismaService.note.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    CreatedAt: "desc",
                },
            }),
        ]);

        return new PaginatedResponseDto(
            page,
            limit,
            total,

            notes.map((note: Note) => this.toNoteResponse(note)),
        );
    }

    async update(id: number, contactId?: number, content?: string): Promise<GetNoteResponseDto> {
        const note = await this.read(id);

        if (contactId !== undefined) {
            await this.contactService.read(contactId);
        }

        const updatedNote = await this.prismaService.note.update({
            where: {
                Id: note.id,
            },
            data: {
                ...(contactId !== undefined && { ContactId: contactId, }),
                ...(content !== undefined && { Content: content, }),
            },
        });

        return this.toNoteResponse(updatedNote);
    }

    async delete(id: number): Promise<void> {
        const note = await this.read(id);

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
