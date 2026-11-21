export class BatchSendsRankingResponseDto {
    constructor(
        public waiting: number,
        public processing: number,
        public sent: number,
        public error: number,
    ) {}
}
