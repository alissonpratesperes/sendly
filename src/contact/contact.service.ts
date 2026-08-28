import { Contact } from '@prisma/client';
import type { CountryCode } from 'libphonenumber-js';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ListService } from 'src/list/list.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { GetContactParamDto } from './dtos/getContactParam.dto';
import { ListContactQueryDto } from './dtos/listContactQuery.dto';
import { GetContactResponseDto } from './dtos/getContactResponse.dto';
import { ListContactResponseDto } from './dtos/listContactResponse.dto';
import { CreateContactCommandDto } from './dtos/createContactCommand.dto';
import { UpdateContactCommandDto } from './dtos/updateContactCommand.dto';

@Injectable()
export class ContactService {
    constructor(
        private readonly listService: ListService,
        private readonly prismaService: PrismaService,
        private readonly companyService: CompanyService,
    ) {}

    private normalizePhone(phone: string, country: CountryCode): string {
        const phoneNumber = parsePhoneNumberFromString(phone, {
            defaultCountry: country,
            extract: false,
        });

        if (!phoneNumber || !phoneNumber.isValid()) {
            throw new BadRequestException("Invalid phone number");
        }

        return phoneNumber.number;
    }

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

    private buildContactListWhere(query: ListContactQueryDto) {
        return {
            DeletedAt: null,
            ...(query.search
                ? {
                    OR: [
                        { Name: { contains: query.search } },
                        { Phone: { contains: query.search } },
                    ],
                }
            : {}),
        };
    }

    async create(command: CreateContactCommandDto): Promise<GetContactResponseDto> {
        await this.companyService.read({ id: command.companyId, });
        await this.listService.read({ id: command.listId, });

        const createdContact = await this.prismaService.contact.create({
            data: {
                CompanyId: command.companyId,
                ListId: command.listId,
                Name: command.name,
                Phone: this.normalizePhone(command.phone, command.country as CountryCode),
            },
        });

        return this.toContactResponse(createdContact);
    }

    async read(params: GetContactParamDto): Promise<GetContactResponseDto> {
        const contact = await this.prismaService.contact.findUnique({
            where: {
                Id: params.id,
                DeletedAt: null,
            },
        });

        if(!contact) {
            throw new NotFoundException("Contact not found");
        }

        return this.toContactResponse(contact);
    }

    async list(query: ListContactQueryDto): Promise<ListContactResponseDto> {
        const skip = (query.page - 1) * query.limit;
        const where = this.buildContactListWhere(query);

        const [total, contacts] = await Promise.all([
            this.prismaService.contact.count({
                where,
            }),
            this.prismaService.contact.findMany({
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
        const data = contacts.map((contact) => this.toContactResponse(contact));

        return new ListContactResponseDto(
            query.page,
            query.limit,
            total,

            totalPages,
            hasNextPage,
            hasPreviousPage,

            data,
        );
    }

    async update(params: GetContactParamDto, command: UpdateContactCommandDto): Promise<GetContactResponseDto> {
        const contact = await this.read(params);

        let normalizedPhone: string | undefined;

        if (command.companyId !== undefined) {
            await this.companyService.read({ id: command.companyId, });
        }
        if (command.listId !== undefined) {
            await this.listService.read({ id: command.listId, });
        }
        if (command.phone !== undefined) {
            if (command.country === undefined) {
                throw new BadRequestException("Country is required when updating phone");
            }

            normalizedPhone = this.normalizePhone(command.phone, command.country as CountryCode);
        }

        const updatedContact = await this.prismaService.contact.update({
            where: {
                Id: contact.id,
            },
            data: {
                ...(command.companyId !== undefined && {
                    CompanyId: command.companyId,
                }),
                ...(command.listId !== undefined && {
                    ListId: command.listId,
                }),
                ...(command.name !== undefined && {
                    Name: command.name,
                }),
                ...(normalizedPhone !== undefined && {
                    Phone: normalizedPhone,
                }),
            },
        });

        return this.toContactResponse(updatedContact);
    }

    async delete(params: GetContactParamDto): Promise<void> {
        const contact = await this.read(params);

        await this.prismaService.contact.update({
            where: {
                Id: contact.id,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
