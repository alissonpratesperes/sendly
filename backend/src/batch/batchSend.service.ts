import { ClsService } from 'nestjs-cls';
import { BatchSend, BatchSend_Status, Prisma } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ContactService } from '../contact/contact.service';
import { TemplateService } from '../template/template.service';
import { TemplateSnapshot } from './types/templateSnapshot.type';

@Injectable()
export class BatchSendService {
    constructor(
        private readonly clsService: ClsService,
        private readonly prismaService: PrismaService,
        private readonly contactService: ContactService,
        private readonly templateService: TemplateService,
    ) {}

    private async validateAndBuildTemplateSnapshot(companyId: number, templateId: number, contactIds: number[]): Promise<TemplateSnapshot> {
        const template = await this.templateService.read(templateId);

        if (template.companyId !== companyId) {
            throw new BadRequestException(`Template "${templateId}" does not belong to the batch company`);
        }

        const contacts = await this.contactService.findByIds(
            companyId,
            contactIds,
        );

        if (contacts.length !== contactIds.length) {
            throw new BadRequestException("One or more contacts do not belong to the batch company");
        }

        return {
            id: template.id,
            name: template.name,
            content: template.content as unknown as Prisma.InputJsonValue,
        };
    }

    async create(tx: Prisma.TransactionClient, companyId: number, batchId: number, templateId: number, contactIds: number[]): Promise<number[]> {
        const templateSnapshot = await this.validateAndBuildTemplateSnapshot(companyId, templateId, contactIds);

        const createdBatchSends = await tx.batchSend.createManyAndReturn({
            data: contactIds.map((contactId) => ({
                CompanyId: companyId,
                BatchId: batchId,
                ContactId: contactId,
                TemplateId: templateId,
                TemplateSnapshot: templateSnapshot,
                Status: BatchSend_Status.WAITING,
                ScheduledAt: new Date(),
            })),

            select: {
                Id: true,
            },
        });

        return createdBatchSends.map((batchSend) => batchSend.Id);
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

    async readByBatchId(tx: Prisma.TransactionClient, batchId: number): Promise<{ currentTemplateId: number; currentContactIds: number[]; }> {
        const batchSends = await tx.batchSend.findMany({
            where: {
                BatchId: batchId,

                Batch: {
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

    async readForProcessing(id: number): Promise<Prisma.BatchSendGetPayload<{ include: { Batch: true; Contact: true; }; }>> {
        const batchSendForProcessing = await this.prismaService.client.batchSend.findFirst({
            where: {
                Id: id,

                Batch: {
                    DeletedAt: null,

                    Company: {
                        DeletedAt: null,
                    },
                },
                Contact: {
                    DeletedAt: null,

                    Company: {
                        DeletedAt: null,
                    },
                    List: {
                        DeletedAt: null,

                        Company: {
                            DeletedAt: null,
                        },
                    },
                },
            },
            include: {
                Batch: true,
                Contact: true,
            },
        });

        if (!batchSendForProcessing) {
            throw new NotFoundException("BatchSend not found");
        }

        return batchSendForProcessing;
    }

    async countByStatus(batchId: number, statuses: BatchSend_Status[]): Promise<number> {
        return this.prismaService.client.batchSend.count({
            where: {
                BatchId: batchId,
                Status: {
                    in: statuses,
                },

                Batch: {
                    DeletedAt: null,
                },
            },
        });
    }

    async update(tx: Prisma.TransactionClient, companyId: number, batchId: number, templateId: number, contactIds: number[]): Promise<number[]> {
        const templateSnapshot = await this.validateAndBuildTemplateSnapshot(companyId, templateId, contactIds);

        await tx.batchSend.deleteMany({
            where: {
                BatchId: batchId,
                Status: BatchSend_Status.WAITING,

                Batch: {
                    DeletedAt: null,
                },
            },
        });
        const createdBatchSends = await tx.batchSend.createManyAndReturn({
            data: contactIds.map((contactId) => ({
                CompanyId: companyId,
                BatchId: batchId,
                ContactId: contactId,
                TemplateId: templateId,
                TemplateSnapshot: templateSnapshot,
                Status: BatchSend_Status.WAITING,
            })),

            select: {
                Id: true,
            },
        });

        return createdBatchSends.map((batchSend) => batchSend.Id);
    }

    async startProcessing(id: number): Promise<boolean> {
        this.clsService.set("isSystemOperation", true);

        const updatedBatchSend = await this.prismaService.client.batchSend.updateMany({
            where: {
                Id: id,
                Status: {
                    in: [ BatchSend_Status.WAITING, BatchSend_Status.PROCESSING ],
                },

                Batch: {
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

    async markAsFailed(id: number, errorCode: string, errorMessage: string): Promise<void> {
        this.clsService.set("isSystemOperation", true);

        const updatedBatchSend = await this.prismaService.client.batchSend.updateMany({
            where: {
                Id: id,
                Status: BatchSend_Status.PROCESSING,

                Batch: {
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

    async markAsSent(id: number, messageId: string): Promise<void> {
        this.clsService.set("isSystemOperation", true);

        const updatedBatchSend = await this.prismaService.client.batchSend.updateMany({
            where: {
                Id: id,
                Status: BatchSend_Status.PROCESSING,

                Batch: {
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
