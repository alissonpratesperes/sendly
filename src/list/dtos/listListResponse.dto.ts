import { GetListResponseDto } from './getListResponse.dto';

export class ListListResponseDto {
    constructor(
        public page: number,
        public limit: number,
        public total: number,

        public totalPages: number,
        public hasNextPage: boolean,
        public hasPreviousPage: boolean,

        public data: GetListResponseDto[],
    ) {}
}
