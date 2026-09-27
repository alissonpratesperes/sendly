export interface BatchResponseDto {
    id: number;
    companyId: number;
    templateId: number;
    listId: number;

    name: string;
    startedAt: string | null;
    endedAt: string | null;

    status: string;

    createdAt: string;
    updatedAt: string;
}
