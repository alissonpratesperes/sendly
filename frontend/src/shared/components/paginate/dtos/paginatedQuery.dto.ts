import { BatchStatus } from '../../../../core/batch/enums/batchStatus.enum';
import { BatchSendStatus } from '../../../../core/batch/enums/batchSendStatus.enum';

export interface PaginatedQueryDto {
    page: number;
    limit: number;

    search?: string;
    listId?: number;
    templateId?: number;
    situation?: BatchStatus;
    status?: BatchSendStatus;
    active?: Boolean;

    companyId?: number;
}
