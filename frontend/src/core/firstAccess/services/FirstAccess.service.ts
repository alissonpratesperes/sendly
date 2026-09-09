import { FirstAccessPasswordDTO } from '../dtos/FirstAccessPasswordDTO.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';

const endpoint = "auth/alterarSenha";

export const ChangePassword = async (passwordData: FirstAccessPasswordDTO, options?: { isFirstAccess?: boolean; temporaryFirstAccessToken?: string; }) => {
    const { isFirstAccess = false, temporaryFirstAccessToken } = options || {};

    return await axiosInstance.post(endpoint, { ...passwordData, primeiroAcesso: isFirstAccess }, { headers: temporaryFirstAccessToken ? { Authorization: `Bearer ${temporaryFirstAccessToken}` } : {} });
};