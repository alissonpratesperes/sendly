import { BatchSend, BatchSend_Status, Prisma } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { TemplateSnapshot } from './types/templateSnapshot.type';

@Injectable()
export class BatchSendService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    private async validateAndBuildTemplateSnapshot(tx: Prisma.TransactionClient, companyId: number, templateId: number, contactIds: number[]): Promise<TemplateSnapshot> {
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
        });

        if (contacts.length !== contactIds.length) {
            throw new BadRequestException("One or more contacts do not belong to the batch company");
        }

        return {
            id: template.Id,
            name: template.Name,
            content: template.Content as unknown as Prisma.InputJsonValue,
        };
    }

    async create(tx: Prisma.TransactionClient, companyId: number, batchId: number, templateId: number, contactIds: number[]): Promise<number[]> {
        const templateSnapshot = await this.validateAndBuildTemplateSnapshot(tx, companyId, templateId, contactIds);
        const createdBatchSends = await Promise.all(
            contactIds.map((contactId) =>
                tx.batchSend.create({
                    data: {
                        CompanyId: companyId,
                        BatchId: batchId,
                        ContactId: contactId,
                        TemplateId: templateId,
                        TemplateSnapshot: templateSnapshot,
                        Status: BatchSend_Status.WAITING,
                        ScheduledAt: new Date(),
                    },
                    select: {
                        Id: true,
                    },
                }),
            ),
        );

        return createdBatchSends.map(({ Id }) => Id);
    }

    async read(id: number): Promise<BatchSend> {
        const batchSend = await this.prismaService.client.batchSend.findFirst({
            where: {
                Id: id,

                Batch: {
                    DeletedAt: null,

                    Company: {
                        DeletedAt: null,
                    },
                },
            },
        });

        if(!batchSend) {
            throw new NotFoundException("BatchSend not found");
        }

        return batchSend;
    }

    async readByBatchId(tx: Prisma.TransactionClient, companyId: number, batchId: number): Promise<{ currentTemplateId: number; currentContactIds: number[]; }> {
        const batchSends = await tx.batchSend.findMany({
            where: {
                CompanyId: companyId,
                BatchId: batchId,

                Batch: {
                    CompanyId: companyId,
                    DeletedAt: null,
                },
            },
            select: {
                ContactId: true,
                TemplateId: true,
            },
        });

        if (batchSends.length === 0) {
            throw new BadRequestException("Batch has no sends");
        }

        return {
            currentTemplateId: batchSends[0].TemplateId,
            currentContactIds: batchSends.map((batchSend) => batchSend.ContactId),
        };
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

    async update(tx: Prisma.TransactionClient, companyId: number, batchId: number, templateId: number, contactIds: number[]): Promise<number[]> {
        const templateSnapshot = await this.validateAndBuildTemplateSnapshot(tx, companyId, templateId, contactIds);

        await tx.batchSend.deleteMany({
            where: {
                CompanyId: companyId,
                BatchId: batchId,
                Status: BatchSend_Status.WAITING,

                Batch: {
                    CompanyId: companyId,
                    DeletedAt: null,
                },
            },
        });

        const createdBatchSends = await Promise.all(
            contactIds.map((contactId) =>
                tx.batchSend.create({
                    data: {
                        CompanyId: companyId,
                        BatchId: batchId,
                        ContactId: contactId,
                        TemplateId: templateId,
                        TemplateSnapshot: templateSnapshot,
                        Status: BatchSend_Status.WAITING,
                        ScheduledAt: new Date(),
                    },
                    select: {
                        Id: true,
                    },
                }),
            ),
        );

        return createdBatchSends.map(({ Id }) => Id);
    }

    async startProcessing(companyId: number, id: number): Promise<boolean> {
        const updatedBatchSend = await this.prismaService.client.batchSend.updateMany({
            where: {
                Id: id,
                CompanyId: companyId,

                Status: {
                    in: [
                        BatchSend_Status.WAITING,
                        BatchSend_Status.PROCESSING,
                    ],
                },

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
                Status: BatchSend_Status.FAILED,
                ErrorCode: errorCode,
                ErrorMessage: errorMessage,
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
}
