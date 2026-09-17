import { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

export interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;

    headers: AxiosRequestHeaders;
}
