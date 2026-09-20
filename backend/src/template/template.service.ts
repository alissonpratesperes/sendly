import { Prisma, Template } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { TemplateParser } from './parsers/templateParser.parser';
import { TemplateBuilder } from './builders/templateBuilder.builder';
import { WhatsAppMessage } from '../common/types/whatsAppMessage.type';
import { ParsedTemplate } from './interfaces/parsedTemplate.interface';
import { GetTemplateResponseDto } from './dtos/getTemplateResponse.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';

@Injectable()
export class TemplateService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly companyService: CompanyService,
        private readonly templateParser: TemplateParser,
        private readonly templateBuilder: TemplateBuilder,
    ) {}

    buildForSending(content: string): WhatsAppMessage {
        const parsedTemplate = this.templateParser.parse(content);

        return this.templateBuilder.build(parsedTemplate);
    }

    private toTemplateResponse(template: Template): GetTemplateResponseDto {
        return new GetTemplateResponseDto(
            template.Id,
            template.CompanyId,

            template.Name,
            template.Content as unknown as ParsedTemplate,

            template.CreatedAt,
            template.UpdatedAt,
        );
    }

    private toPrismaJson(content: ParsedTemplate): Prisma.InputJsonValue {
        return content as unknown as Prisma.InputJsonValue;
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

    async create(companyId: number, name: string, content: ParsedTemplate): Promise<GetTemplateResponseDto> {
        await this.companyService.read(companyId);

        const createdTemplate = await this.prismaService.client.template.create({
            data: {
                CompanyId: companyId,
                Name: name,
                Content: this.toPrismaJson(content),
            },
        });

        return this.toTemplateResponse(createdTemplate);
    }

    async read(id: number): Promise<GetTemplateResponseDto> {
        const template = await this.prismaService.client.template.findFirst({
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
            this.prismaService.client.template.count({
                where,
            }),
            this.prismaService.client.template.findMany({
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

    async update(id: number, companyId?: number, name?: string, content?: ParsedTemplate): Promise<GetTemplateResponseDto> {
        const template = await this.read(id);

        if (companyId !== undefined) {
            await this.companyService.read(companyId);
        }

        const updatedTemplate = await this.prismaService.client.template.update({
            where: {
                Id: template.id,
            },
            data: {
                ...(companyId !== undefined && { CompanyId: companyId, }),
                ...(name !== undefined && { Name: name, }),
                ...(content !== undefined && { Content: this.toPrismaJson(content), }),
            },
        });

        return this.toTemplateResponse(updatedTemplate);
    }

    async delete(id: number): Promise<void> {
        const template = await this.read(id);

        await this.prismaService.client.template.update({
            where: {
                Id: template.id,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
