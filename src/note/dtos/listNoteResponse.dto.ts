import { GetNoteResponseDto } from './getNoteResponse.dto';

export class ListNoteResponseDto {
    constructor(
        public page: number,
        public limit: number,
        public total: number,

        public totalPages: number,
        public hasNextPage: boolean,
        public hasPreviousPage: boolean,

        public data: GetNoteResponseDto[],
    ) {}
}
