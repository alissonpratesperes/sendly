export interface PaginatedQueryDto {
    page: number;
    limit: number;
    search?: string;
    companyId?: number;
}
