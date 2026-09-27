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

        await this.markAsRunning(batch.CompanyId, batch.Id);
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

    async update(id: number, name?: string, templateId?: number, listId?: number): Promise<GetBatchResponseDto> {
        const { batch, batchSendIds } = await this.prismaService.client.$transaction(async (tx) => {
            const foundBatch = await tx.batch.findFirst({
                where: {
                    Id: id,
                    DeletedAt: null,

                    Company: {
                        DeletedAt: null,
                    },
                },
            });

            if (!foundBatch) {
                throw new NotFoundException("Batch not found");
            }
            if (foundBatch.Status !== Batch_Status.PENDING) {
                throw new BadRequestException("Only pending batches can be updated");
            }

            const currentBatchSend = await this.batchSendService.readByBatchId(tx, foundBatch.CompanyId, foundBatch.Id,);
            const updatedBatch = await tx.batch.updateMany({
                where: {
                    Id: id,
                    CompanyId: foundBatch.CompanyId,
                    Status: Batch_Status.PENDING,
                    DeletedAt: null,
                },
                data: {
                    ...(name !== undefined && { Name: name, }),
                },
            });

            if (updatedBatch.count === 0) {
                throw new BadRequestException("Batch is no longer pending");
            }

            const batch = await tx.batch.findFirstOrThrow({
                where: {
                    Id: id,
                    DeletedAt: null,
                },
            });

            let contactIds = currentBatchSend.currentContactIds;

            if (listId !== undefined) {
                const contacts = await this.contactService.findForBatch(batch.CompanyId, listId);

                contactIds = contacts.map(contact => contact.Id);
            }

            const batchSendIds = await this.batchSendService.update(
                tx,

                batch.CompanyId,
                batch.Id,
                templateId ?? currentBatchSend.currentTemplateId,
                contactIds,
            );

            return {
                batch,
                batchSendIds,
            };
        });

        await this.markAsRunning(batch.CompanyId, batch.Id);
        await this.queueService.enqueueBatchSends(batchSendIds);

        return this.toBatchResponse(batch);
    }

    async markAsRunning(companyId: number, id: number): Promise<void> {
        const runningBatch = await this.prismaService.client.batch.updateMany({
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

        if (runningBatch.count === 0) {
            throw new BadRequestException("Batch is no longer pending");
        }
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

        const failedCount = await this.batchSendService.countByStatus(batch.CompanyId, id, [BatchSend_Status.FAILED]);
        const successCount = await this.batchSendService.countByStatus(batch.CompanyId, id, [ BatchSend_Status.SENT, BatchSend_Status.DELIVERED, BatchSend_Status.READ, ]);

        if (failedCount > 0 && successCount === 0) {
            await this.markAsFailed(batch.CompanyId, id);
        } else if (failedCount > 0 && successCount > 0) {
            await this.markAsPartial(batch.CompanyId, id);
        } else {
            await this.markAsCompleted(batch.CompanyId, id);
        }
    }

    async delete(id: number): Promise<void> {
        const batch = await this.read(id);

        if (batch.status !== Batch_Status.PENDING) {
            throw new BadRequestException("Only pending batches can be deleted");
        }

        const result = await this.prismaService.client.batch.updateMany({
            where: {
                Id: batch.id,
                CompanyId: batch.companyId,
                Status: Batch_Status.PENDING,
                DeletedAt: null,
            },
            data: {
                DeletedAt: new Date(),
            },
        });

        if (result.count === 0) {
            throw new BadRequestException("Batch is no longer pending");
        }
    }
}
