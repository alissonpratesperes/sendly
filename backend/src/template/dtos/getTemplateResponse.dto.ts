export class GetTemplateResponseDto {
    constructor(
        public id: number,
        public companyId: number,

        public name: string,
        public content: Record<string, unknown>,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
