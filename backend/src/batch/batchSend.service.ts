import { BadRequestException, Injectable } from '@nestjs/common';
import { BatchSend, BatchSend_Status, Contact, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { TemplateSnapshot } from './types/templateSnapshot.type';
import { GetBatchSendResponseDto } from './dtos/getBatchSendResponseDto';
import { PaginatedResponseDto } from 'src/common/dtos/paginatedResponse.dto';
import { ParsedTemplate } from 'src/template/interfaces/parsedTemplate.interface';
import { TemplateInterpolator } from '../template/interpolators/templateInterpolator.interpolator';

@Injectable()
export class BatchSendService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly templateInterpolator: TemplateInterpolator,
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

    private buildBatchSendListWhere(batchId: number): Prisma.BatchSendWhereInput {
        return {
            BatchId: batchId,

            Batch: {
                DeletedAt: null,
            },
            Company: {
                DeletedAt: null,
            },
        };
    }

    private async validateAndBuildTemplateSnapshot(tx: Prisma.TransactionClient, companyId: number, templateId: number, contactIds: number[]): Promise<{template: TemplateSnapshot, contacts: Contact[]; }> {
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
        const createdBatchSends = await Promise.all(contacts.map((contact) => {
            const interpolatedTemplate = this.templateInterpolator.interpolate(template.content as unknown as ParsedTemplate, contact.Name);
            const templateSnapshot = { id: template.id, name: template.name, content: interpolatedTemplate, }

            return tx.batchSend.create({
                data: {
                    CompanyId: companyId,
                    BatchId: batchId,
                    ContactId: contact.Id,
                    TemplateSnapshot: templateSnapshot as unknown as Prisma.InputJsonValue,
                    Status: BatchSend_Status.WAITING,
                    ScheduledAt: new Date(),
                },
                select: {
                    Id: true,
                },
            });
        } ));

        return createdBatchSends.map(({ Id }) => Id);
    }

    async listByBatchId(batchId: number, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<GetBatchSendResponseDto>> {
        const where = this.buildBatchSendListWhere(batchId);
        const [total, batchSends] = await Promise.all([
            this.prismaService.client.batchSend.count({
                where,
            }),
            this.prismaService.client.batchSend.findMany({
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
                Status: BatchSend_Status.ERROR,
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
