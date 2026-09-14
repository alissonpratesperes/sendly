import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { refresh } from '../services/authentication.service';
import { RetryableAxiosRequestConfig } from '../types/retryableRequestAxiosConfig.type';
import { clearAuthenticationStorage, getAuthenticationStorage, setAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';

const authenticatedApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { "Content-Type": "application/json" }
});
const handleLogout = () => {
    clearAuthenticationStorage();

    window.location.href = "/authentication";
};

let refreshPromise: Promise<string> | null = null;

authenticatedApi.interceptors.request.use(
    (config) => {
        const { accessToken } = getAuthenticationStorage();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
authenticatedApi.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
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
                refreshPromise = refresh(refreshToken).then((response) => {
                    setAuthenticationStorage(response);

                    return response.accessToken;
                }).finally(() => {
                    refreshPromise = null;
                });
            }

            const accessToken = await refreshPromise;

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return authenticatedApi(originalRequest);
        } catch (refreshError) {
            handleLogout();

            return Promise.reject(refreshError);
        }
    }
);

export default authenticatedApi;
