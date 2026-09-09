import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import environment from '../../../environments/environment';
import { isTokenExpiredUtil } from '../../../shared/utils/isTokenExpiredUtil.util';

const axiosInstance = axios.create({ baseURL: environment.apiBaseUrl, headers: { "Content-Type": "application/json" } });

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("");

        if (accessToken) {
            if (isTokenExpiredUtil(accessToken)) {
                localStorage.clear();

                window.location.href = "/authentication";

                return Promise.reject("Acesso expirado. Por favor, faça login novamente");
            }

            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === StatusCodes.UNAUTHORIZED) {
            localStorage.clear();

            return Promise.reject(error);
        };

        return Promise.reject(error);
    }
);

export default axiosInstance;
