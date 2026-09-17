import { AuthenticationStorage } from '../interfaces/authenticationStorage.interface';
import { AuthenticationTokenPair } from '../../core/authentication/types/authenticationTokenPair.type';
import { AuthenticatedUserResponse } from '../../core/authentication/interfaces/authenticatedUserResponse.interface';

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const LOGGED_USER_KEY = "userInformation";

export function getAuthenticationStorage(): AuthenticationStorage {
    const userDataObject = localStorage.getItem(LOGGED_USER_KEY);

    return {
        accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
        refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
        userInformation: userDataObject ? JSON.parse(userDataObject) : null,
    };
}

export function setAuthenticationStorage(data: AuthenticationTokenPair | AuthenticatedUserResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

    if ("user" in data && data.user) {
        localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(data.user));
    }
}

export function clearAuthenticationStorage(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(LOGGED_USER_KEY);
}
