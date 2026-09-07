import { BatchSend, BatchSend_Status, Prisma } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { ContactService } from '../contact/contact.service';
import { TemplateService } from '../template/template.service';
import { TemplateSnapshot } from './types/templateSnapshot.type';

@Injectable()
export class BatchSendService {
    constructor(
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
            content: template.content as Prisma.InputJsonValue,
        };
    }

    async create(tx: Prisma.TransactionClient, companyId: number, batchId: number, templateId: number, contactIds: number[]): Promise<number[]> {
        const templateSnapshot = await this.validateAndBuildTemplateSnapshot(companyId, templateId, contactIds);

        await tx.batchSend.createMany({
            data: contactIds.map((contactId) => ({
                BatchId: batchId,
                ContactId: contactId,
                TemplateId: templateId,
                TemplateSnapshot: templateSnapshot,
                Status: BatchSend_Status.WAITING,
                ScheduledAt: new Date(),
            })),
        });

        const batchSends = await tx.batchSend.findMany({
            where: {
                BatchId: batchId,
            },
            select: {
                Id: true,
            },
        });

        return batchSends.map((batchSend) => batchSend.Id);
    }

    async read(id: number): Promise<BatchSend> {
        const batchSend = await this.prismaService.batchSend.findFirst({
            where: {
                Id: id,

                Batch: {
                    DeletedAt: null,
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

    async readForProcessing(id: number): Promise<BatchSend> {
        const batchSendForProcessing = await this.prismaService.batchSend.findFirst({
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
        return this.prismaService.batchSend.count({
            where: {
                BatchId: batchId,
                Status: {
                    in: statuses,
                },
            },
        });
    }

    async update(tx: Prisma.TransactionClient, companyId: number, batchId: number, templateId: number, contactIds: number[]): Promise<number[]> {
        const templateSnapshot = await this.validateAndBuildTemplateSnapshot(companyId, templateId, contactIds);

        await tx.batchSend.deleteMany({
            where: {
                BatchId: batchId,
            },
        });
        await tx.batchSend.createMany({
            data: contactIds.map((contactId) => ({
                BatchId: batchId,
                ContactId: contactId,
                TemplateId: templateId,
                TemplateSnapshot: templateSnapshot,
                Status: BatchSend_Status.WAITING,
            })),
        });

        const batchSends = await tx.batchSend.findMany({
            where: {
                BatchId: batchId,
            },
            select: {
                Id: true,
            },
        });

        return batchSends.map((batchSend) => batchSend.Id);
    }

    async startProcessing(id: number): Promise<boolean> {
        const updatedBatchSend = await this.prismaService.batchSend.updateMany({
            where: {
                Id: id,
                Status: BatchSend_Status.WAITING,
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

    async markAsSent(id: number, messageId: string): Promise<void> {
        const updatedBatchSend = await this.prismaService.batchSend.updateMany({
            where: {
                Id: id,
                Status: BatchSend_Status.PROCESSING,
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

    async markAsFailed(id: number, errorCode: string, errorMessage: string): Promise<void> {
        const updatedBatchSend = await this.prismaService.batchSend.updateMany({
            where: {
                Id: id,
                Status: BatchSend_Status.PROCESSING,
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
}
