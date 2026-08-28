import { GetContactResponseDto } from './getContactResponse.dto';

export class ListContactResponseDto {
    constructor(
        public page: number,
        public limit: number,
        public total: number,

        public totalPages: number,
        public hasNextPage: boolean,
        public hasPreviousPage: boolean,

        public data: GetContactResponseDto[],
    ) {}
}
