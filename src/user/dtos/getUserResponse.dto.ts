import { GetCompanyResponseDto } from '../../company/dtos/getCompanyResponse.dto';

export class GetUserResponseDto {
    constructor(
        public id: number,

        public company: GetCompanyResponseDto,

        public name: string,
        public email: string,



        public isFirstAccess: boolean,
        public isSystemRoot: boolean,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
