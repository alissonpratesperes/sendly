export interface PaginatedRequestDTO {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    search?: string;
    appliedFilters?: {
        redeId?: number[];
        lojasIds?: number[];
        categoriaProdutoId?: number[];
        produtosIds?: number[];
    };
};