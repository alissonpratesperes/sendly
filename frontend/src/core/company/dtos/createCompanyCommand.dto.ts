export interface CreateCompanyCommandDto {
    name: string;
    document: string;
    description?: string | null;
}
