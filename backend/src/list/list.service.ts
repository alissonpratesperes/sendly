import { List } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { GetListParamDto } from './dtos/getListParam.dto';
import { ListListQueryDto } from './dtos/listListQuery.dto';
import { CompanyService } from '../company/company.service';
import { GetListResponseDto } from './dtos/getListResponse.dto';
import { ListListResponseDto } from './dtos/listListResponse.dto';
import { CreateListCommandDto } from './dtos/createListCommand.dto';
import { UpdateListCommandDto } from './dtos/updateListCommand.dto';

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

    private buildListListWhere(query: ListListQueryDto) {
        return {
            DeletedAt: null,
            ...(query.search
                ? {
                    OR: [
                        { Name: { contains: query.search } },
                        { Subject: { contains: query.search } },
                    ],
                }
            : {}),
        };
    }

    async create(command: CreateListCommandDto): Promise<GetListResponseDto> {
        await this.companyService.read({ id: command.companyId, });

        const createdList = await this.prismaService.list.create({
            data: {
                CompanyId: command.companyId,
                Name: command.name,
                Subject: command.subject,
                Color: command.color,
            },
        });

        return this.toListResponse(createdList);
    }

    async read(params: GetListParamDto): Promise<GetListResponseDto> {
        const list = await this.prismaService.list.findFirst({
            where: {
                Id: params.id,
                DeletedAt: null,
            },
        });

        if(!list) {
            throw new NotFoundException("List not found");
        }

        return this.toListResponse(list);
    }

    async list(query: ListListQueryDto): Promise<ListListResponseDto> {
        const skip = (query.page - 1) * query.limit;
        const where = this.buildListListWhere(query);

        const [total, lists] = await Promise.all([
            this.prismaService.list.count({
                where,
            }),
            this.prismaService.list.findMany({
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
        const data = lists.map((list) => this.toListResponse(list));

        return new ListListResponseDto(
            query.page,
            query.limit,
            total,

            totalPages,
            hasNextPage,
            hasPreviousPage,

            data,
        );
    }

    async update(params: GetListParamDto, command: UpdateListCommandDto): Promise<GetListResponseDto> {
        const list = await this.read(params);

        if (command.companyId !== undefined) {
            await this.companyService.read({ id: command.companyId, });
        }

        const updatedList = await this.prismaService.list.update({
            where: {
                Id: list.id,
            },
            data: {
                ...(command.companyId !== undefined && {
                    CompanyId: command.companyId,
                }),
                ...(command.name !== undefined && {
                    Name: command.name,
                }),
                ...(command.subject !== undefined && {
                    Subject: command.subject,
                }),
                ...(command.color !== undefined && {
                    Color: command.color,
                }),
            },
        });

        return this.toListResponse(updatedList);
    }

    async delete(params: GetListParamDto): Promise<void> {
        const list = await this.read(params);

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
