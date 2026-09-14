export interface PaginatedResponseDto<T> {
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;

    page: number;
    limit: number;
    total: number;

    data: T[];
}
