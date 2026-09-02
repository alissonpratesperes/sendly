import { List } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { GetListResponseDto } from './dtos/getListResponse.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';

@Injectable()
export class ListService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly companyService: CompanyService,
    ) {}

    private toListResponse(list: List): GetListResponseDto {
        return new GetListResponseDto(
            list.Id,
            list.CompanyId,

            list.Name,
            list.Subject,
            list.Color,

            list.CreatedAt,
            list.UpdatedAt,
        );
    }

    private buildListListWhere(search?: string) {
        return {
            DeletedAt: null,
            ...(search
                ? {
                    OR: [
                        { Name: { contains: search } },
                        { Subject: { contains: search } },
                    ],
                }
            : {}),
        };
    }

    async create(companyId: number, name: string, subject: string, color: string): Promise<GetListResponseDto> {
        await this.companyService.read(companyId);

        const createdList = await this.prismaService.list.create({
            data: {
                CompanyId: companyId,
                Name: name,
                Subject: subject,
                Color: color,
            },
        });

        return this.toListResponse(createdList);
    }

    async read(id: number): Promise<GetListResponseDto> {
        const list = await this.prismaService.list.findFirst({
            where: {
                Id: id,
                DeletedAt: null,
            },
        });

        if(!list) {
            throw new NotFoundException("List not found");
        }

        return this.toListResponse(list);
    }

    private async findByCompany(id: number, companyId: number): Promise<List | null> {
        return this.prismaService.list.findFirst({
            where: {
                Id: id,
                CompanyId: companyId,
                DeletedAt: null,
            },
        });
    }

    async validateBelongsToCompany(id: number, companyId: number): Promise<void> {
        if (!await this.findByCompany(id, companyId)) {
            throw new NotFoundException("List not found");
        }
    }

    async list(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponseDto<GetListResponseDto>> {
        const where = this.buildListListWhere(search);
        const [total, lists] = await Promise.all([
            this.prismaService.list.count({
                where,
            }),
            this.prismaService.list.findMany({
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

            lists.map((list: List) => this.toListResponse(list)),
        );
    }

    async update(id: number, companyId?: number, name?: string, subject?: string, color?: string): Promise<GetListResponseDto> {
        const list = await this.read(id);

        if (companyId !== undefined) {
            await this.companyService.read(companyId);
        }

        const updatedList = await this.prismaService.list.update({
            where: {
                Id: list.id,
            },
            data: {
                ...(companyId !== undefined && { CompanyId: companyId, }),
                ...(name !== undefined && { Name: name, }),
                ...(subject !== undefined && { Subject: subject, }),
                ...(color !== undefined && { Color: color, }),
            },
        });

        return this.toListResponse(updatedList);
    }

    async delete(id: number): Promise<void> {
        const list = await this.read(id);

        await this.prismaService.list.update({
            where: {
                Id: list.id,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
