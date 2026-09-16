export interface ContactResponseDto {
    id: number;
    companyId: number;
    listId: number;

    name: string;
    phone: string;
    active: boolean;

    createdAt: string;
    updatedAt: string;
}
