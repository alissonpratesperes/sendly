import { toast } from 'react-toastify';

export function decodeJWTUtil(token: string) {
    try {
        const base64Url = token.split('.')[1];

        if (!base64Url) {
            toast.error('Erro ao processar o Token de autenticação');
        };

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(base64);

        return JSON.parse(decoded);
    } catch (error) {
        toast.error(`Erro ao decodificar o Token: ${error}`);
    };
};