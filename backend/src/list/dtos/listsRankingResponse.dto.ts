export class ListsRankingResponseDto {
    constructor(
        public listId: number,
        public listName: string,
        public totalBatches: number,
    ) {}
}
