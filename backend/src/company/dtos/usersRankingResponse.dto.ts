export class UsersRankingResponseDto {
    constructor(
        public companyId: number,
        public companyName: string,
        public totalUsers: number,
    ) {}
}
