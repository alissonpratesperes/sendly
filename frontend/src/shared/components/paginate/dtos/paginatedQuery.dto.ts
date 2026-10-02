export interface PaginatedQueryDto {
    page: number;
    limit: number;

    search?: string;
    listId?: number;
    templateId?: number;

    companyId?: number;
}
