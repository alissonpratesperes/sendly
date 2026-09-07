export interface AuthenticatedUser {
    id: number;
    email: string;
    companyId: number;
    isSystemRoot: boolean;
}
