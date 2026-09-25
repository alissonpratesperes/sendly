import { parse } from 'csv-parse/sync';
import { ClsService } from 'nestjs-cls';
import { Contact, Prisma } from '@prisma/client';
import { type CountryCode } from 'libphonenumber-js';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ListService } from '../list/list.service';
import { PrismaService } from '../prisma/prisma.service';
import { parseContacts } from './parsers/contact.parser';
import { ParsedContact } from './types/parsedContact.type';
import { CompanyService } from '../company/company.service';
import { GetContactResponseDto } from './dtos/getContactResponse.dto';
import { ImportContactErrorDto } from './dtos/importContactError.dto';
import { CsvContactBefore } from './interfaces/csvContactBefore.interface';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { ImportContactResponseDto } from './dtos/importContactResponse.dto';
import { formatContactPhoneNumber } from '../common/formatters/contactPhoneNumber.formatter';

@Injectable()
export class ContactService {
    constructor(
        private readonly clsService: ClsService,
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
            contact.Active,

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

            List: {
                DeletedAt: null,
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

    async findForBatch(companyId: number, listId: number): Promise<Contact[]> {
        const contacts = await this.prismaService.client.contact.findMany({
            where: {
                List: {
                    id: listId,
                    companyId,
                },

                active: true,
            },
        });

        if (contacts.length === 0) {
            throw new BadRequestException("Contact list has no active contacts to communicate");
        }

        return contacts;
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

    async update(id: number, companyId?: number, listId?: number, name?: string, phone?: string, country?: string, active?: boolean): Promise<GetContactResponseDto> {
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

    async import(listId: number, file: Express.Multer.File): Promise<ImportContactResponseDto> {
        const companyId = this.clsService.get<number>("companyId");

        await this.companyService.read(companyId);
        await this.listService.validateBelongsToCompany(listId, companyId);

        const content = file.buffer.toString("utf-8");
        const lines = content.split(/\r?\n/);
        const hasSeparatorDeclaration = lines[0]?.startsWith("sep=");
        const csvContent = hasSeparatorDeclaration ? lines.slice(1).join("\n") : content;
        const records = parse(csvContent, { columns: true, skip_empty_lines: true, }) as CsvContactBefore[];
        const contacts = records.map((record) => {
            const name = record.Nome?.trim() ?? "";
            const phone = record.Telefone?.trim() ?? "";

            return {
                name,
                phone,
            };
        });
        const parsedContacts = parseContacts(contacts);
        const validContacts = parsedContacts.filter((contact) => contact.normalizedPhone !== null);
        const uniqueContacts = new Map<string, ParsedContact>();
        const duplicatedContacts: ParsedContact[] = [];

        for (const contact of validContacts) {
            const phone = contact.normalizedPhone!;

            if (uniqueContacts.has(phone)) {
                duplicatedContacts.push(contact);

                continue;
            }

            uniqueContacts.set(phone, contact);
        }

        const invalidContacts = parsedContacts
            .filter((contact: ParsedContact) => {
                return contact.normalizedPhone === null
            })
            .map((contact: ParsedContact) => new ImportContactErrorDto(
                contact.name,
                contact.phone,
                contact.normalizedPhone,
                contact.country,
                contact.error ?? "Unknown batch import error",
            ));
        const existingContacts = await this.prismaService.client.contact.findMany({
            where: {
                CompanyId: companyId,
                Phone: {
                    in: [...uniqueContacts.keys()],
                },
            },
            select: {
                Phone: true,
            },
        });
        const existingPhones = new Set(existingContacts.map((contact: Partial<Contact>) => contact.Phone));
        const contactsToCreate: ParsedContact[] = [];
        const existingContactsErrors: ParsedContact[] = [];

        for (const contact of uniqueContacts.values()) {
            if (existingPhones.has(contact.normalizedPhone!)) {
                existingContactsErrors.push(contact);

                continue;
            }

            contactsToCreate.push(contact);
        }

        const duplicatedContactErrors = duplicatedContacts.map(
            (contact: ParsedContact) =>
                new ImportContactErrorDto(
                    contact.name,
                    contact.phone,
                    contact.normalizedPhone,
                    contact.country,
                    "Duplicated phone number",
                ),
        );
        const existingContactErrors = existingContactsErrors.map(
            (contact: ParsedContact) =>
                new ImportContactErrorDto(
                    contact.name,
                    contact.phone,
                    contact.normalizedPhone,
                    contact.country,
                    "Contact already exists in this company",
                ),
        );
        const errors = [
            ...invalidContacts,
            ...duplicatedContactErrors,
            ...existingContactErrors,
        ];

        await this.prismaService.client.contact.createMany({
            data: contactsToCreate.map((contact: ParsedContact) => ({
                CompanyId: companyId,
                ListId: listId,
                Name: contact.name,
                Phone: contact.normalizedPhone!,
                Active: true,
            })),
        });

        return new ImportContactResponseDto(
            parsedContacts.length,
            contactsToCreate.length,
            errors.length,
            errors,
        );
    }
}
