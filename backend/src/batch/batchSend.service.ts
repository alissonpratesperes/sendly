import { BatchSend, BatchSend_Status, Prisma } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ContactService } from '../contact/contact.service';
import { TemplateService } from '../template/template.service';
import { TemplateSnapshot } from './types/templateSnapshot.type';

@Injectable()
export class BatchSendService {
    constructor(
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

    async create(tx: Prisma.TransactionClient, companyId: number, batchId: number, templateId: number, contactIds: number[]): Promise<void> {
        const templateSnapshot = await this.validateAndBuildTemplateSnapshot(companyId, templateId, contactIds);

        await tx.batchSend.createMany({
            data: contactIds.map((contactId) => ({
                BatchId: batchId,
                ContactId: contactId,
                TemplateId: templateId,
                TemplateSnapshot: templateSnapshot,
                Status: BatchSend_Status.WAITING,
            })),
        });
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

    async update(tx: Prisma.TransactionClient, companyId: number, batchId: number, templateId: number, contactIds: number[]): Promise<void> {
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
    }
}
