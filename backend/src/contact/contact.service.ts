import { Contact, Prisma } from '@prisma/client';
import type { CountryCode } from 'libphonenumber-js';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ListService } from '../list/list.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { GetContactResponseDto } from './dtos/getContactResponse.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { formatContactPhoneNumber } from '../common/formatters/contactPhoneNumber.formatter';

@Injectable()
export class ContactService {
    constructor(
        private readonly listService: ListService,
        private readonly prismaService: PrismaService,
        private readonly companyService: CompanyService,
    ) {}

    private toContactResponse(contact: Contact): GetContactResponseDto {
        return new GetContactResponseDto(
            contact.Id,
            contact.CompanyId,
            contact.ListId,

            contact.Name,
            contact.Phone,

            contact.CreatedAt,
            contact.UpdatedAt,
        );
    }

    private buildContactListWhere(search?: string): Prisma.ContactWhereInput {
        return {
            DeletedAt: null,
            ...(search
                ? {
                    OR: [
                        { Name: { contains: search } },
                        { Phone: { contains: search } },
                    ],
                }
            : {}),

            Company: {
                DeletedAt: null,
            },
            List: {
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
        };
    }

    async create(companyId: number, listId: number, name: string, phone: string, country: string): Promise<GetContactResponseDto> {
        await this.companyService.read(companyId);
        await this.listService.validateBelongsToCompany(listId, companyId);

        const createdContact = await this.prismaService.client.contact.create({
            data: {
                CompanyId: companyId,
                ListId: listId,
                Name: name,
                Phone: formatContactPhoneNumber(phone, country as CountryCode),
                Active: true,
            },
        });

        return this.toContactResponse(createdContact);
    }

    async read(id: number): Promise<GetContactResponseDto> {
        const contact = await this.prismaService.client.contact.findFirst({
            where: {
                Id: id,
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
        });

        if(!contact) {
            throw new NotFoundException("Contact not found");
        }

        return this.toContactResponse(contact);
    }

    async findByIds(companyId: number, contactIds: number[]): Promise<Contact[]> {
        return this.prismaService.client.contact.findMany({
            where: {
                Id: {
                    in: contactIds,
                },
                CompanyId: companyId,
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
        });
    }

    async list(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponseDto<GetContactResponseDto>> {
        const where = this.buildContactListWhere(search);
        const [total, contacts] = await Promise.all([
            this.prismaService.client.contact.count({
                where,
            }),
            this.prismaService.client.contact.findMany({
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

            contacts.map((contact: Contact) => this.toContactResponse(contact)),
        );
    }

    async update(id: number, companyId?: number, listId?: number, name?: string, phone?: string, country?: string, active?: string): Promise<GetContactResponseDto> {
        const contact = await this.read(id);
        const targetCompanyId = companyId ?? contact.companyId;
        const targetListId = listId ?? contact.listId;

        let normalizedPhone: string | undefined;

        if (companyId !== undefined) {
            await this.companyService.read(companyId);
        }

        await this.listService.validateBelongsToCompany(targetListId, targetCompanyId);

        if (phone !== undefined) {
            if (country === undefined) {
                throw new BadRequestException("Country is required when updating phone");
            }

            normalizedPhone = formatContactPhoneNumber(phone, country as CountryCode);
        }

        const updatedContact = await this.prismaService.client.contact.update({
            where: {
                Id: contact.id,
            },
            data: {
                ...(companyId !== undefined && { CompanyId: companyId, }),
                ...(listId !== undefined && { ListId: listId, }),
                ...(name !== undefined && { Name: name, }),
                ...(normalizedPhone !== undefined && { Phone: normalizedPhone, }),
                ...(active !== undefined && { Active: active, }),
            },
        });

        return this.toContactResponse(updatedContact);
    }

    async delete(id: number): Promise<void> {
        const contact = await this.read(id);

        await this.prismaService.client.contact.update({
            where: {
                Id: contact.id,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
