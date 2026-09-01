export class GetContactResponseDto {
    constructor(
        public id: number,
        public companyId: number,
        public listId: number,

        public name: string,
        public phone: string,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
