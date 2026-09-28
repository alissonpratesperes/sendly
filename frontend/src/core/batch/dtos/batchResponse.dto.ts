import { BatchBadgeVariant } from '../../../shared/components/statusBadge/enums/batchBadgeVariant.enum';

export interface BatchResponseDto {
    id: number;
    companyId: number;
    templateId: number;
    listId: number;

    name: string;
    startedAt: string | null;
    endedAt: string | null;

    status: BatchBadgeVariant

    createdAt: string;
    updatedAt: string;
}
