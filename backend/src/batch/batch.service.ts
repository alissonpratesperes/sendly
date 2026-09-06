import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Batch, Batch_Status, Prisma } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { BatchSendService } from './batchSend.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { GetBatchResponseDto } from './dtos/getBatchResponse.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { requireEnvironmentVariable } from 'src/common/utils/requireEnvironmentVariable.util';

@Injectable()
export class BatchService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly companyService: CompanyService,
        private readonly batchSendService: BatchSendService,

        @InjectQueue(requireEnvironmentVariable("REDIS_QUEUE_NAME"))
        private readonly batchSendQueue: Queue,
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

    async create(companyId: number, name: string, templateId: number, contactIds: number[]): Promise<GetBatchResponseDto> {
        await this.companyService.read(companyId);

        const { batch, batchSendIds } = await this.prismaService.$transaction(async (tx) => {
            const batch = await tx.batch.create({
                data: {
                    CompanyId: companyId,
                    Name: name,
                },
            });
            const batchSendIds = await this.batchSendService.create(
                tx,

                batch.CompanyId,
                batch.Id,
                templateId,
                contactIds,
            );

            return {
                batch,
                batchSendIds,
            };
        });

        await this.batchSendQueue.addBulk(
            batchSendIds.map((batchSendId) => ({
                name: 'send',
                data: {
                    batchSendId,
                },
            })),
        );

        return this.toBatchResponse(batch);
    }

    async read(id: number): Promise<GetBatchResponseDto> {
        const batch = await this.prismaService.batch.findFirst({
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
            this.prismaService.batch.count({
                where,
            }),
            this.prismaService.batch.findMany({
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

    async update(id: number, name?: string, templateId?: number, contactIds?: number[]): Promise<GetBatchResponseDto> {
        const { batch, batchSendIds } = await this.prismaService.$transaction(async (tx) => {
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

            const currentBatchSend = await this.batchSendService.readByBatchId(tx, id);
            const updatedBatch = await tx.batch.updateMany({
                where: {
                    Id: id,
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

            const batch = await tx.batch.findUniqueOrThrow({
                where: {
                    Id: id,
                },
            });

            const batchSendIds = await this.batchSendService.update(
                tx,

                batch.CompanyId,
                batch.Id,
                templateId ?? currentBatchSend.currentTemplateId,
                contactIds ?? currentBatchSend.currentContactIds,
            );

            return {
                batch,
                batchSendIds,
            };
        });

        await this.batchSendQueue.addBulk(
            batchSendIds.map((batchSendId) => ({
                name: 'send',
                data: {
                    batchSendId,
                },
            })),
        );

        return this.toBatchResponse(batch);
    }

    async delete(id: number): Promise<void> {
        const batch = await this.read(id);

        if (batch.status !== Batch_Status.PENDING) {
            throw new BadRequestException("Only pending batches can be deleted");
        }

        const result = await this.prismaService.batch.updateMany({
            where: {
                Id: batch.id,
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
