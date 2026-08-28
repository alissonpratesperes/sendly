export class GetListResponseDto {
    constructor(
        public id: number,
        public companyId: number,

        public name: string,
        public subject: string,
        public color: string,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
