import { Company } from '@prisma/client';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { GetCompanyParamDto } from './dtos/getCompanyParam.dto';
import { ListCompanyQueryDto } from './dtos/listCompanyQuery.dto';
import { GetCompanyResponseDto } from './dtos/getCompanyResponse.dto';
import { ListCompanyResponseDto } from './dtos/listCompanyResponse.dto';
import { CreateCompanyCommandDto } from './dtos/createCompanyCommand.dto';
import { UpdateCompanyCommandDto } from './dtos/updateCompanyCommand.dto';

@Injectable()
export class CompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    private formatCompanyDocument(value: string): string {
        const digits = value.replace(/\D/g, "");

        return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }

    private toCompanyResponse(company: Company): GetCompanyResponseDto {
        return new GetCompanyResponseDto(
            company.Id,

            company.Name,
            this.formatCompanyDocument(company.Document),
            company.Description,

            company.CreatedAt,
            company.UpdatedAt,
        );
    }

    private buildCompanyListWhere(query: ListCompanyQueryDto) {
        return {
            DeletedAt: null,
            ...(query.search
                ? {
                    OR: [
                        { Name: { contains: query.search } },
                        { Document: { contains: query.search } },
                    ],
                }
            : {}),
        };
    }

    async create(command: CreateCompanyCommandDto): Promise<GetCompanyResponseDto> {
        const documentAlreadyUsed = await this.prismaService.company.findUnique({
            where: {
                Document: command.document,
            },
        });

        if(documentAlreadyUsed) {
            throw new ConflictException("A company with this CNPJ is already registered");
        }

        const createdCompany = await this.prismaService.company.create({
            data: {
                Name: command.name,
                Document: command.document,
                Description: command.description,
            },
        });

        return this.toCompanyResponse(createdCompany);
    }

    async read(params: GetCompanyParamDto): Promise<GetCompanyResponseDto> {
        const company = await this.prismaService.company.findUnique({
            where: {
                Id: params.id,
                DeletedAt: null,
            },
        });

        if(!company) {
            throw new NotFoundException("Company not found");
        }

        return this.toCompanyResponse(company);
    }

    async list(query: ListCompanyQueryDto): Promise<ListCompanyResponseDto> {
        const skip = (query.page - 1) * query.limit;
        const where = this.buildCompanyListWhere(query);

        const [total, companies] = await Promise.all([
            this.prismaService.company.count({
                where,
            }),
            this.prismaService.company.findMany({
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
        const data = companies.map((company) => this.toCompanyResponse(company));

        return new ListCompanyResponseDto(
            query.page,
            query.limit,
            total,

            totalPages,
            hasNextPage,
            hasPreviousPage,

            data,
        );
    }

    async update(params: GetCompanyParamDto, command: UpdateCompanyCommandDto): Promise<GetCompanyResponseDto> {
        const company = await this.read(params);
        const updatedCompany = await this.prismaService.company.update({
            where: {
                Id: company.id
            },
            data: {
                ...(command.name !== undefined && {
                    Name: command.name,
                }),
                ...(command.document !== undefined && {
                    Document: command.document,
                }),
                ...(command.description !== undefined && {
                    Description: command.description,
                }),
            },
        });

        return this.toCompanyResponse(updatedCompany);
    }

    async delete(params: GetCompanyParamDto): Promise<void> {
        const company = await this.read(params);

        await this.prismaService.company.update({
            where: {
                Id: company.id
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
