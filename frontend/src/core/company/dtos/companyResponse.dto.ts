export interface CompanyResponseDto {
    id: number;
    name: string;
    document: string;
    description: string | null;

    createdAt: string;
    updatedAt: string;
}
