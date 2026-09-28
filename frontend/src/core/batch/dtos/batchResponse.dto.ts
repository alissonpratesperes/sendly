import { BatchStatus } from '../enums/batchStatus.enum';

export interface BatchResponseDto {
    id: number;
    companyId: number;
    templateId: number;
    listId: number;

    name: string;
    startedAt: string | null;
    endedAt: string | null;

    status: BatchStatus;

    createdAt: string;
    updatedAt: string;
}
