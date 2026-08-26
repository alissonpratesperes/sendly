export class GetCompanyResponseDto {
    constructor(
        public id: number,
        public name: string,
        public document: string,
        public description: string | null,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
