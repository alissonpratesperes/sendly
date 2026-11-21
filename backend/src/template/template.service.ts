import { ClsService } from 'nestjs-cls';
import { Prisma, Template } from '@prisma/client';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { TemplateParser } from './parsers/templateParser.parser';
import { TemplateBuilder } from './builders/templateBuilder.builder';
import { WhatsAppMessage } from '../common/types/whatsAppMessage.type';
import { ParsedTemplate } from './interfaces/parsedTemplate.interface';
import { GetTemplateResponseDto } from './dtos/getTemplateResponse.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { TemplatesRankingResponseDto } from './dtos/templatesRankingResponse.dto';

@Injectable()
export class TemplateService {
    constructor(
        private readonly clsService: ClsService,
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

    async rank(): Promise<TemplatesRankingResponseDto[]> {
        const companyId = this.clsService.get<number>("companyId");
        const isSystemRoot = this.clsService.get<boolean>("isSystemRoot");

        if (!isSystemRoot && companyId === undefined) {
            throw new ForbiddenException("Company context not found");
        }

        const client = isSystemRoot ? this.prismaService.authClient : this.prismaService.client;
        const ranking = await client.$queryRaw<{ templateId: number; templateName: string; totalBatches: bigint; }[]>`
            SELECT
                t.Id AS templateId,
                t.Name AS templateName,
                COUNT(b.Id) AS totalBatches
            FROM
                Template t
            INNER JOIN
                Batch b
            ON
                b.TemplateId = t.Id
            INNER JOIN
                Company c
            ON
                c.Id = t.CompanyId
            WHERE
                t.DeletedAt IS NULL
            AND
                b.DeletedAt IS NULL
            AND
                c.DeletedAt IS NULL

                    ${ !isSystemRoot ? Prisma.sql`AND c.Id = ${ companyId }` : Prisma.empty }
        GROUP BY
            t.Id,
            t.Name
        ORDER BY
            totalBatches DESC,
            t.Id ASC
        `;

        return ranking.map((item) =>
            new TemplatesRankingResponseDto(
                Number(item.templateId),
                item.templateName,
                Number(item.totalBatches),
            ),
        );
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

    async list(page: number = 1, limit: number = 15, search?: string): Promise<PaginatedResponseDto<GetTemplateResponseDto>> {
        const where = this.buildTemplateListWhere(search);
        const templates = await this.prismaService.client.template.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [
                { CreatedAt: "desc" },
                { Id: "desc" },
            ],
        });
        const total = await this.prismaService.client.template.count({
            where,
        });

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
