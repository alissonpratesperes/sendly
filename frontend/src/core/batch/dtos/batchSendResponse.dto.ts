import { BatchSendStatus } from '../enums/batchSendStatus.enum';
import { TemplateFormData } from '../../template/schemas/templateFormSchema.schema';

export interface BatchSendResponseDto {
    id: number;
    companyId: number;
    batchId: number;
    contactId: number;

    templateSnapshot: { id: number; name: string; content: TemplateFormData["content"]; };

    status: BatchSendStatus;

    attempts: number;
    errorCode: string | null;
    errorMessage: string | null;

    scheduledAt: string | null;
    startedAt: string | null;
    completedAt: string | null;

    messageId: string | null;

    createdAt: string;
    updatedAt: string;
}
