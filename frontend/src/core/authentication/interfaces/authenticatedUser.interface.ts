export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    isSystemRoot: boolean;

    company: {
        id: number;
        name: string;
    };
}
