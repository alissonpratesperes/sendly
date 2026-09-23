import { StatusCodes } from 'http-status-codes';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { refresh } from '../services/authentication.service';
import { AuthenticationTokenPair } from '../types/authenticationTokenPair.type';
import { RetryableAxiosRequestConfig } from '../types/retryableRequestAxiosConfig.type';
import { clearAuthenticationStorage, getAuthenticationStorage, setAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';

const authenticatedApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});
const handleLogout = (): void => {
    clearAuthenticationStorage();

    window.location.href = "/authentication";
}

let refreshPromise: Promise<string> | null = null;

authenticatedApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { accessToken } = getAuthenticationStorage();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);
authenticatedApi.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

        if (error.response?.status !== StatusCodes.UNAUTHORIZED || !originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const { refreshToken } = getAuthenticationStorage();

        if (!refreshToken) {
            handleLogout();

            return Promise.reject(error);
        }

        try {
            if(!refreshPromise) {
                refreshPromise = refresh(refreshToken).then((response: AuthenticationTokenPair) => {
                    setAuthenticationStorage(response);

                    if (!response?.accessToken) {
                        throw new Error("The new 'AccessToken' was not returned yet");
                    }

                    return response.accessToken;
                }).finally(() => {
                    refreshPromise = null;
                });
            }

            const newAccessToken = await refreshPromise;

            if (typeof originalRequest.headers.set === "function") {
                originalRequest.headers.set("Authorization", `Bearer ${ newAccessToken }`);
            } else {
                originalRequest.headers.Authorization = `Bearer ${ newAccessToken }`;
            }

            return authenticatedApi(originalRequest);
        } catch (refreshError) {
            handleLogout();

            return Promise.reject(refreshError);
        }
    }
);

export default authenticatedApi;
