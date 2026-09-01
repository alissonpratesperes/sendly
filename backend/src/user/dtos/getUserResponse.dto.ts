export class GetUserResponseDto {
    constructor(
        public id: number,
        public companyId: number,

        public name: string,
        public email: string,



        public isFirstAccess: boolean,
        public isSystemRoot: boolean,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
