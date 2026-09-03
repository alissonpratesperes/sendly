import { Prisma, Template } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { GetTemplateResponseDto } from './dtos/getTemplateResponse.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginatedResponse.dto';

@Injectable()
export class TemplateService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly companyService: CompanyService,
    ) {}

    private toTemplateResponse(template: Template): GetTemplateResponseDto {
        return new GetTemplateResponseDto(
            template.Id,
            template.CompanyId,

            template.Name,
            template.Content as Record<string, unknown>,

            template.CreatedAt,
            template.UpdatedAt,
        );
    }

    private buildTemplateListWhere(search?: string): Prisma.TemplateWhereInput {
        return {
            DeletedAt: null,
            ...(search
                ? {
                    OR: [
                        { Name: { contains: search } },
                    ],
                }
            : {}),

            Company: {
                DeletedAt: null,
            },
        };
    }

    async create(companyId: number, name: string, content: Prisma.InputJsonValue): Promise<GetTemplateResponseDto> {
        await this.companyService.read(companyId);

        const createdTemplate = await this.prismaService.template.create({
            data: {
                CompanyId: companyId,
                Name: name,
                Content: content,
            },
        });

        return this.toTemplateResponse(createdTemplate);
    }

    async read(id: number): Promise<GetTemplateResponseDto> {
        const template = await this.prismaService.template.findFirst({
            where: {
                Id: id,
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
        });

        if(!template) {
            throw new NotFoundException("Template not found");
        }

        return this.toTemplateResponse(template);
    }

    async list(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponseDto<GetTemplateResponseDto>> {
        const where = this.buildTemplateListWhere(search);
        const [total, templates] = await Promise.all([
            this.prismaService.template.count({
                where,
            }),
            this.prismaService.template.findMany({
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

            templates.map((template: Template) => this.toTemplateResponse(template)),
        );
    }

    async update(id: number, companyId?: number, name?: string, content?: Prisma.InputJsonValue): Promise<GetTemplateResponseDto> {
        const template = await this.read(id);

        if (companyId !== undefined) {
            await this.companyService.read(companyId);
        }

        const updatedTemplate = await this.prismaService.template.update({
            where: {
                Id: template.id,
            },
            data: {
                ...(companyId !== undefined && { CompanyId: companyId, }),
                ...(name !== undefined && { Name: name, }),
                ...(content !== undefined && { Content: content, }),
            },
        });

        return this.toTemplateResponse(updatedTemplate);
    }

    async delete(id: number): Promise<void> {
        const template = await this.read(id);

        await this.prismaService.template.update({
            where: {
                Id: template.id,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
