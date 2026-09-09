import { toast } from 'react-toastify';

export function decodeJWTUtil(token: string) {
    try {
        const base64Url = token.split(".")[1];

        if (!base64Url) {
            throw new Error("Token JWT inválido");
        }

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedJwtToken = atob(base64);

        return JSON.parse(decodedJwtToken);
    } catch (error) {
        toast.error("Erro ao decodificar o Token JWT");

        throw error;
    }
}
