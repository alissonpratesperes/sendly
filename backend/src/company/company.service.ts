import { ClsService } from 'nestjs-cls';
import { Company, Prisma } from '@prisma/client';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { GetCompanyResponseDto } from './dtos/getCompanyResponse.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { formatCompanyDocument } from '../common/formatters/companyDocument.formatter';

@Injectable()
export class CompanyService {
    constructor(
        private readonly clsService: ClsService,
        private readonly prismaService: PrismaService,
    ) {}

    private toCompanyResponse(company: Company): GetCompanyResponseDto {
        return new GetCompanyResponseDto(
            company.Id,

            company.Name,
            formatCompanyDocument(company.Document),
            company.Description,

            company.CreatedAt,
            company.UpdatedAt,
        );
    }

    private buildCompanyListWhere(search?: string): Prisma.CompanyWhereInput {
        return {
            DeletedAt: null,
            ...(search
                ? {
                    OR: [
                        { Name: { contains: search } },
                        { Document: { contains: search } },
                    ],
                }
            : {}),
        };
    }

    async create(name: string, document: string, description: string | null): Promise<GetCompanyResponseDto> {
        this.clsService.set("isSystemOperation", true);

        const documentAlreadyUsed = await this.prismaService.client.company.findUnique({
            where: {
                Document: document,
            },
        });

        if(documentAlreadyUsed) {
            throw new ConflictException("A company with this CNPJ is already registered");
        }

        const createdCompany = await this.prismaService.client.company.create({
            data: {
                Name: name,
                Document: document,
                Description: description,
            },
        });

        return this.toCompanyResponse(createdCompany);
    }

    async read(id: number): Promise<GetCompanyResponseDto> {
        const company = await this.prismaService.client.company.findFirst({
            where: {
                Id: id,
                DeletedAt: null,
            },
        });

        if(!company) {
            throw new NotFoundException("Company not found");
        }

        return this.toCompanyResponse(company);
    }

    async list(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponseDto<GetCompanyResponseDto>> {
        const where = this.buildCompanyListWhere(search);
        const [total, companies] = await Promise.all([
            this.prismaService.client.company.count({
                where,
            }),
            this.prismaService.client.company.findMany({
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

            companies.map((company: Company) => this.toCompanyResponse(company)),
        );
    }

    async update(id: number, name?: string, document?: string, description?: string | null): Promise<GetCompanyResponseDto> {
        const company = await this.read(id);
        const updatedCompany = await this.prismaService.client.company.update({
            where: {
                Id: company.id,
            },
            data: {
                ...(name !== undefined && { Name: name, }),
                ...(document !== undefined && { Document: document, }),
                ...(description !== undefined && { Description: description, }),
            },
        });

        return this.toCompanyResponse(updatedCompany);
    }

    async delete(id: number): Promise<void> {
        const company = await this.read(id);

        await this.prismaService.client.company.update({
            where: {
                Id: company.id,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
