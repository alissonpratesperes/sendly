import { ClsService } from 'nestjs-cls';
import { BatchSend, BatchSend_Status, Contact, Prisma } from '@prisma/client';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { TemplateSnapshot } from './types/templateSnapshot.type';
import { BatchSendSchedulerService } from './batchSendScheduler.service';
import { GetBatchSendResponseDto } from './dtos/getBatchSendResponseDto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { ParsedTemplate } from '../template/interfaces/parsedTemplate.interface';
import { BatchSendsRankingResponseDto } from './dtos/batchSendsRankingResponse.dto';
import { requireEnvironmentVariable } from 'src/common/utils/requireEnvironmentVariable.util';
import { TemplateInterpolator } from '../template/interpolators/templateInterpolator.interpolator';
import { generateSpacedIntervalInMilliseconds } from 'src/common/utils/generateSpacedIntervalInMilliseconds.util';

@Injectable()
export class BatchSendService {
    constructor(
        private readonly clsService: ClsService,
        private readonly prismaService: PrismaService,
        private readonly templateInterpolator: TemplateInterpolator,
        private readonly batchSendSchedulerService: BatchSendSchedulerService,
    ) {}

    private toBatchSendResponse(batchSend: BatchSend): GetBatchSendResponseDto {
        return new GetBatchSendResponseDto(
            batchSend.Id,
            batchSend.CompanyId,
            batchSend.BatchId,
            batchSend.ContactId,

            batchSend.TemplateSnapshot as unknown as TemplateSnapshot,

            batchSend.Status,

            batchSend.Attempts,
            batchSend.ErrorCode,
            batchSend.ErrorMessage,

            batchSend.ScheduledAt,
            batchSend.StartedAt,
            batchSend.CompletedAt,

            batchSend.MessageId,

            batchSend.CreatedAt,
            batchSend.UpdatedAt,
        );
    }

    private buildBatchSendListWhere(batchId: number, status?: BatchSend_Status): Prisma.BatchSendWhereInput {
        return {
            BatchId: batchId,

            ...(status && { Status: status, }),

            Batch: {
                DeletedAt: null,
            },
            Company: {
                DeletedAt: null,
            },
        };
    }

    private async validateAndBuildTemplateSnapshot(tx: Prisma.TransactionClient, companyId: number, templateId: number, contactIds: number[]): Promise<{ template: TemplateSnapshot, contacts: Contact[]; }> {
        const template = await tx.template.findFirst({
            where: {
                Id: templateId,
                CompanyId: companyId,
                DeletedAt: null,
            },
        });

        if (!template) {
            throw new BadRequestException(`Template "${ templateId }" does not belong to the batch company`);
        }

        const contacts = await tx.contact.findMany({
            where: {
                Id: {
                    in: contactIds,
                },
                CompanyId: companyId,
                DeletedAt: null,
            },
            orderBy: {
                Id: "asc",
            },
        });

        if (contacts.length !== contactIds.length) {
            throw new BadRequestException("One or more contacts do not belong to the batch company");
        }

        const templateSnapshot: TemplateSnapshot = {
            id: template.Id,
            name: template.Name,
            content: template.Content as unknown as Prisma.InputJsonValue,
        }

        return {
            template: templateSnapshot,
            contacts,
        };
    }

    async create(tx: Prisma.TransactionClient, companyId: number, batchId: number, templateId: number, contactIds: number[]): Promise<number[]> {
        const { template, contacts } = await this.validateAndBuildTemplateSnapshot(tx, companyId, templateId, contactIds);
        const createdBatchSendIds: number[] = [];

        let previousScheduledAt = new Date();

        for (const contact of contacts) {
            const interval = generateSpacedIntervalInMilliseconds();
            const scheduledAt = this.batchSendSchedulerService.getNextScheduledAt(previousScheduledAt, interval);
            const interpolatedTemplate = this.templateInterpolator.interpolate(template.content as unknown as ParsedTemplate, contact.Name);
            const templateSnapshot = { id: template.id, name: template.name, content: interpolatedTemplate };
            const createdBatchSend = await tx.batchSend.create({
                data: {
                    CompanyId: companyId,
                    BatchId: batchId,
                    ContactId: contact.Id,
                    TemplateSnapshot: templateSnapshot as unknown as Prisma.InputJsonValue,
                    Status: BatchSend_Status.WAITING,
                    ScheduledAt: scheduledAt,
                },
                select: {
                    Id: true,
                },
            });

            createdBatchSendIds.push(createdBatchSend.Id);

            previousScheduledAt = scheduledAt;
        }

        return createdBatchSendIds;
    }

    async rank(batchId: number): Promise<BatchSendsRankingResponseDto> {
        const companyId = this.clsService.get<number>("companyId");
        const isSystemRoot = this.clsService.get<boolean>("isSystemRoot");

        if (!isSystemRoot && companyId === undefined) {
            throw new ForbiddenException("Company context not found");
        }

        const client = isSystemRoot ? this.prismaService.authClient : this.prismaService.client;
        const [ranking] = await client.$queryRaw<{ waiting: bigint; processing: bigint; sent: bigint; error: bigint; }[]>`
            SELECT
                COALESCE(SUM(CASE WHEN bs.Status = 'WAITING' THEN 1 ELSE 0 END), 0) AS waiting,
                COALESCE(SUM(CASE WHEN bs.Status = 'PROCESSING' THEN 1 ELSE 0 END), 0) AS processing,
                COALESCE(SUM(CASE WHEN bs.Status = 'SENT' THEN 1 ELSE 0 END), 0) AS sent,
                COALESCE(SUM(CASE WHEN bs.Status = 'ERROR' THEN 1 ELSE 0 END), 0) AS error
            FROM
                BatchSend bs
            INNER JOIN
                Batch b
            ON
                b.Id = bs.BatchId
            INNER JOIN
                Company c
            ON
                c.Id = bs.CompanyId
            WHERE
                bs.BatchId = ${ batchId }
            AND
                b.DeletedAt IS NULL
            AND
                c.DeletedAt IS NULL

                    ${ !isSystemRoot ? Prisma.sql`AND c.Id = ${ companyId }` : Prisma.empty }
        `;

        return new BatchSendsRankingResponseDto(
            Number(ranking.waiting),
            Number(ranking.processing),
            Number(ranking.sent),
            Number(ranking.error),
        );
    }

    async listByBatchId(batchId: number, page: number = 1, limit: number = 15, status?: BatchSend_Status): Promise<PaginatedResponseDto<GetBatchSendResponseDto>> {
        const where = this.buildBatchSendListWhere(batchId, status);
        const batchSends = await this.prismaService.client.batchSend.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [
                { ScheduledAt: "asc" },
                { Id: "asc" },
            ]
        });
        const total = await this.prismaService.client.batchSend.count({
            where,
        });

        return new PaginatedResponseDto(
            page,
            limit,
            total,

            batchSends.map((batchSend) => this.toBatchSendResponse(batchSend))
        );
    }

    async readForProcessingSystem(id: number): Promise<Prisma.BatchSendGetPayload<{ include: { Batch: true; Contact: true; }; }> | null> {
        return this.prismaService.authClient.batchSend.findFirst({
            where: {
                Id: id,

                Batch: {
                    DeletedAt: null,
                },
                Contact: {
                    DeletedAt: null,
                },
            },
            include: {
                Batch: true,
                Contact: true,
            },
        });
    }

    async countByStatus(companyId: number, batchId: number, statuses: BatchSend_Status[]): Promise<number> {
        return this.prismaService.client.batchSend.count({
            where: {
                CompanyId: companyId,
                BatchId: batchId,
                Status: {
                    in: statuses,
                },

                Batch: {
                    CompanyId: companyId,
                    DeletedAt: null,
                },
            },
        });
    }

    async startProcessing(companyId: number, id: number): Promise<boolean> {
        const updatedBatchSend = await this.prismaService.client.batchSend.updateMany({
            where: {
                Id: id,
                CompanyId: companyId,
                Status: BatchSend_Status.WAITING,

                Batch: {
                    CompanyId: companyId,
                    DeletedAt: null,
                },
            },
            data: {
                Status: BatchSend_Status.PROCESSING,
                StartedAt: new Date(),
                Attempts: {
                    increment: 1,
                },
            },
        });

        return updatedBatchSend.count > 0;
    }

    async markAsFailed(companyId: number, id: number, errorCode: string, errorMessage: string): Promise<void> {
        const updatedBatchSend = await this.prismaService.client.batchSend.updateMany({
            where: {
                Id: id,
                CompanyId: companyId,

                Status: BatchSend_Status.PROCESSING,

                Batch: {
                    CompanyId: companyId,
                    DeletedAt: null,
                },
            },
            data: {
                Status: BatchSend_Status.ERROR,
                ErrorCode: errorCode,
                ErrorMessage: errorMessage,
                CompletedAt: new Date(),
            },
        });

        if (updatedBatchSend.count === 0) {
            throw new BadRequestException("BatchSend is no longer processing");
        }
    }

    async markAsSent(companyId: number, id: number, messageId: string): Promise<void> {
        const updatedBatchSend = await this.prismaService.client.batchSend.updateMany({
            where: {
                Id: id,
                CompanyId: companyId,
                Status: BatchSend_Status.PROCESSING,

                Batch: {
                    CompanyId: companyId,
                    DeletedAt: null,
                },
            },
            data: {
                Status: BatchSend_Status.SENT,
                CompletedAt: new Date(),
                MessageId: messageId,
            },
        });

        if (updatedBatchSend.count === 0) {
            throw new BadRequestException("BatchSend is no longer processing");
        }
    }

    async releaseForRetry(companyId: number, id: number): Promise<boolean> {
        const updated = await this.prismaService.client.batchSend.updateMany({
            where: {
                Id: id,
                CompanyId: companyId,
                Status: BatchSend_Status.PROCESSING,

                Batch: {
                    CompanyId: companyId,
                    DeletedAt: null,
                },
            },
            data: {
                Status: BatchSend_Status.WAITING,
            },
        });

        return updated.count > 0;
    }

    async reschedule(companyId: number, id: number, scheduledAt: Date, expectedScheduledAt: Date | null): Promise<boolean> {
        const updated = await this.prismaService.client.batchSend.updateMany({
            where: {
                Id: id,
                CompanyId: companyId,
                ScheduledAt: expectedScheduledAt,
                Status: BatchSend_Status.WAITING,

                Batch: {
                    CompanyId: companyId,
                    DeletedAt: null,
                },
            },
            data: {
                ScheduledAt: scheduledAt,
            },
        });

        return updated.count > 0;
    }
}
