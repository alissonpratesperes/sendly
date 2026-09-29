import { Batch, Batch_Status, BatchSend_Status, Prisma } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { QueueService } from '../queue/queue.service';
import { BatchSendService } from './batchSend.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { ContactService } from 'src/contact/contact.service';
import { GetBatchResponseDto } from './dtos/getBatchResponse.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';

@Injectable()
export class BatchService {
    constructor(
        private readonly queueService: QueueService,
        private readonly prismaService: PrismaService,
        private readonly companyService: CompanyService,
        private readonly contactService: ContactService,
        private readonly batchSendService: BatchSendService,
    ) {}

    private toBatchResponse(batch: Batch): GetBatchResponseDto {
        return new GetBatchResponseDto(
            batch.Id,
            batch.CompanyId,
            batch.TemplateId,
            batch.ListId,

            batch.Name,
            batch.StartedAt,
            batch.EndedAt,

            batch.Status,

            batch.CreatedAt,
            batch.UpdatedAt,
        );
    }

    private buildBatchListWhere(search?: string): Prisma.BatchWhereInput {
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

    async create(companyId: number, name: string, templateId: number, listId: number): Promise<GetBatchResponseDto> {
        await this.companyService.read(companyId);

        const contacts = await this.contactService.findForBatch(companyId, listId);
        const contactIds = contacts.map(contact => contact.Id);
        const { batch, batchSendIds } = await this.prismaService.client.$transaction(async (tx) => {
            const batch = await tx.batch.create({
                data: {
                    CompanyId: companyId,
                    Name: name,
                    TemplateId: templateId,
                    ListId: listId,
                },
            });
            const batchSendIds = await this.batchSendService.create(
                tx,
                companyId,
                batch.Id,
                templateId,
                contactIds,
            );

            return {
                batch,
                batchSendIds,
            };
        });

        await this.queueService.enqueueBatchSends(batchSendIds);

        return this.toBatchResponse(batch);
    }

    async read(id: number): Promise<GetBatchResponseDto> {
        const batch = await this.prismaService.client.batch.findFirst({
            where: {
                Id: id,
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
        });

        if(!batch) {
            throw new NotFoundException("Batch not found");
        }

        return this.toBatchResponse(batch);
    }

    async list(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponseDto<GetBatchResponseDto>> {
        const where = this.buildBatchListWhere(search);
        const [total, batches] = await Promise.all([
            this.prismaService.client.batch.count({
                where,
            }),
            this.prismaService.client.batch.findMany({
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

            batches.map((batch: Batch) => this.toBatchResponse(batch)),
        );
    }

    async markAsRunning(companyId: number, id: number): Promise<void> {
        await this.prismaService.client.batch.updateMany({
            where: {
                Id: id,
                CompanyId: companyId,
                Status: Batch_Status.PENDING,
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
            data: {
                Status: Batch_Status.RUNNING,
                StartedAt: new Date(),
            },
        });
    }

    async markAsPartial(companyId: number, id: number): Promise<void> {
        await this.prismaService.client.batch.updateMany({
            where: {
                Id: id,
                CompanyId: companyId,
                Status: Batch_Status.RUNNING,
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
            data: {
                Status: Batch_Status.PARTIAL,
                EndedAt: new Date(),
            },
        });
    }

    async markAsFailed(companyId: number, id: number): Promise<void> {
        await this.prismaService.client.batch.updateMany({
            where: {
                Id: id,
                CompanyId: companyId,
                Status: Batch_Status.RUNNING,
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
            data: {
                Status: Batch_Status.FAILED,
                EndedAt: new Date(),
            },
        });
    }

    async markAsCompleted(companyId: number, id: number): Promise<void> {
        await this.prismaService.client.batch.updateMany({
            where: {
                Id: id,
                CompanyId: companyId,
                Status: Batch_Status.RUNNING,
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
            data: {
                Status: Batch_Status.FINISHED,
                EndedAt: new Date(),
            },
        });
    }

    async finishIfCompleted(id: number): Promise<void> {
        const batch = await this.prismaService.client.batch.findFirst({
            where: {
                Id: id,
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
            select: {
                CompanyId: true,
            },
        });

        if (!batch) {
            throw new NotFoundException("Batch not found");
        }

        const pendingCount = await this.batchSendService.countByStatus(batch.CompanyId, id, [ BatchSend_Status.WAITING, BatchSend_Status.PROCESSING, ]);

        if (pendingCount > 0) {
            return;
        }

        const failedCount = await this.batchSendService.countByStatus(batch.CompanyId, id, [BatchSend_Status.ERROR, ]);
        const successCount = await this.batchSendService.countByStatus(batch.CompanyId, id, [ BatchSend_Status.SENT, ]);

        if (failedCount > 0 && successCount === 0) {
            await this.markAsFailed(batch.CompanyId, id);
        } else if (failedCount > 0 && successCount > 0) {
            await this.markAsPartial(batch.CompanyId, id);
        } else {
            await this.markAsCompleted(batch.CompanyId, id);
        }
    }
}
