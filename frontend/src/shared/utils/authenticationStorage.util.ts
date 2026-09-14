import { AuthenticationStorage } from '../interfaces/authenticationStorage.interface';
import { AuthenticationTokenPair } from '../../core/authentication/interfaces/authenticationTokenPair.interface';

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function getAuthenticationStorage(): AuthenticationStorage {
    return {
        accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
        refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    };
}

export function setAuthenticationStorage(authenticationTokenPair: AuthenticationTokenPair): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, authenticationTokenPair.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, authenticationTokenPair.refreshToken);
}

export function clearAuthenticationStorage(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}
