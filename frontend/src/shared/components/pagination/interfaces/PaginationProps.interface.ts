export interface PaginationProps {
    pageSize: number;
    totalPages: number;
    currentPage: number;
    customPageOptions?: { value: number; label: number }[];

    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
};