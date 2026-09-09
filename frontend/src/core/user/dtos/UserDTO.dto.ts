export interface UserDTO {
    id?: number;
    nome: string;
    regionalId: number;
    email: string;
    isAdministrador: boolean;
    ativo: boolean;
    isFirstAccess?: boolean;
};