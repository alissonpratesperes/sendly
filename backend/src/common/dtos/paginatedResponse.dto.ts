export class PaginatedResponseDto<T> {
    public readonly totalPages: number;
    public readonly hasNextPage: boolean;
    public readonly hasPreviousPage: boolean;

    constructor(
        public readonly page: number,
        public readonly limit: number,
        public readonly total: number,

        public readonly data: T[],
    ) {
        this.totalPages = Math.ceil(total / limit);
        this.hasNextPage = page < this.totalPages;
        this.hasPreviousPage = page > 1;
    }
}
