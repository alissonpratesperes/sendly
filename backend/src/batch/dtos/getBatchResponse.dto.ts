import { Batch_Status } from '@prisma/client';

export class GetBatchResponseDto {
    constructor(
        public id: number,
        public companyId: number,

        public name: string,
        public startedAt: Date | null,
        public endedAt: Date | null,

        public status: Batch_Status,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
