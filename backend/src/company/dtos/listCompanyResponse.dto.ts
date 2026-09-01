import { GetCompanyResponseDto } from './getCompanyResponse.dto';

export class ListCompanyResponseDto {
    constructor(
        public page: number,
        public limit: number,
        public total: number,

        public totalPages: number,
        public hasNextPage: boolean,
        public hasPreviousPage: boolean,

        public data: GetCompanyResponseDto[],
    ) {}
}
