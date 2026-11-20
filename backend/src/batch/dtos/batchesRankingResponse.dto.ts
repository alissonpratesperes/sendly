export class BatchesRankingResponseDto {
    constructor(
        public pending: number,
        public running: number,
        public partial: number,
        public failed: number,
        public finished: number,
    ) {}
}
