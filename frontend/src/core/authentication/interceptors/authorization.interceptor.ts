import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { refresh } from '../services/authentication.service';
const authenticatedApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

let refreshPromise: Promise<string> | null = null;

authenticatedApi.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

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
        const originalRequest = error.config;

        if (error.response?.status !== StatusCodes.UNAUTHORIZED || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            window.location.href = "/authentication";

            return Promise.reject(error);
        }

        try {
            if(!refreshPromise) {
                refreshPromise = refresh(refreshToken).then((response) => {
                    const { accessToken, refreshToken: newRefreshToken } = response;

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", newRefreshToken);

                    return accessToken;
                }).finally(() => {
                    refreshPromise = null;
                });
            }

            const accessToken = await refreshPromise;

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return authenticatedApi(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            window.location.href = "/authentication";

            return Promise.reject(refreshError);
        }
    }
);

export default authenticatedApi;
