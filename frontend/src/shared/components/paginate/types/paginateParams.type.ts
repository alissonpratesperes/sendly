export type PaginateParams = {
    page: number;
    total: number;
    limit: number;

    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
}
