import api from '../../../shared/api/axios.client';
import { LoginCommandDto } from '../dtos/loginCommand.dto';
import { ResetCommandDto } from '../dtos/resetCommand.dto';
import { ForgotCommandDto } from '../dtos/forgotCommand.dto';
import { AuthenticationTokenPair } from '../types/authenticationTokenPair.type';
import { AuthenticatedUserResponse } from '../interfaces/authenticatedUserResponse.interface';

const BASE_ENDPOINT: string = "authentication";

export const login = async (command: LoginCommandDto): Promise<AuthenticatedUserResponse> => {
    const response = await api.post<AuthenticatedUserResponse>(`${BASE_ENDPOINT}/login`, command);

    return response.data;
}

export const refresh = async (refreshToken: string): Promise<AuthenticationTokenPair> => {
    const response = await api.post<AuthenticationTokenPair>(`${BASE_ENDPOINT}/refresh`, null, {
        headers: { Authorization: `Bearer ${refreshToken}` }
    });

    return response.data;
}

export const forgot = async (command: ForgotCommandDto): Promise<void> => {
    return await api.post(`${BASE_ENDPOINT}/forgot`, command);
}

export const reset = async (passwordResetToken: string, command: ResetCommandDto): Promise<void> => {
    return await api.patch(`${BASE_ENDPOINT}/reset?passwordResetToken=${encodeURIComponent(passwordResetToken)}`, command);
}
