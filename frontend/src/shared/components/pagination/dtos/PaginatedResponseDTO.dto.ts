export interface PaginatedResponseDTO<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
};

export interface PaginatedResponseDto<T> {
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;

    page: number;
    limit: number;
    total: number;

    data: T[];
}
