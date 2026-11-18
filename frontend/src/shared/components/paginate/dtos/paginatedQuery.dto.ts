import { BatchSendStatus } from '../../../../core/batch/enums/batchSendStatus.enum';

export interface PaginatedQueryDto {
    page: number;
    limit: number;

    search?: string;
    listId?: number;
    templateId?: number;
    status?: BatchSendStatus;

    companyId?: number;
}
