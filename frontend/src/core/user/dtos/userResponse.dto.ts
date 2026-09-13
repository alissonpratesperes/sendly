export interface UserResponseDto {
    id: number;
    companyId: number;

    name: string;
    email: string;



    isFirstAccess: boolean;
    isSystemRoot: boolean;

    createdAt: string;
    updatedAt: string;
}
