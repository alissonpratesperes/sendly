import { BatchSend_Status } from '@prisma/client';

import { TemplateSnapshot } from '../types/templateSnapshot.type';

export class GetBatchSendResponseDto {
    constructor(
        public id: number,
        public companyId: number,
        public batchId: number,
        public contactId: number,

        public templateSnapshot: TemplateSnapshot,

        public status: BatchSend_Status,

        public attempts: number,
        public errorCode: string | null,
        public errorMessage: string | null,

        public scheduledAt: Date | null,
        public startedAt: Date | null,
        public completedAt: Date | null,

        public messageId: string | null,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
