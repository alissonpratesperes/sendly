export class TemplatesRankingResponseDto {
    constructor(
        public templateId: number,
        public templateName: string,
        public totalBatches: number,
    ) {}
}
