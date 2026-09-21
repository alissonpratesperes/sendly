import { IdParamDto } from '../../../shared/dtos/idParam.dto';
import { PairingResponseDto } from '../dtos/pairingResponse.dto';
import { BaileysStatusResponseDto } from '../dtos/baileysStatusResponse.dto';
import { CreatePairingCodeCommandDto } from '../dtos/createPairingCodeCommand.dto';
import axiosInstance from '../../../core/authentication/interceptors/authorization.interceptor';

const endpoint = "baileys";

export const Pair = async (param: IdParamDto, command: CreatePairingCodeCommandDto): Promise<PairingResponseDto> => {
    const { data } = await axiosInstance.post<PairingResponseDto>(`${endpoint}/pair/${param.id}`, command);

    return data;
}

export const Status = async (param: IdParamDto): Promise<BaileysStatusResponseDto> => {
    const { data } = await axiosInstance.get<BaileysStatusResponseDto>(`${endpoint}/status/${param.id}`);

    return data;
}

export const Logout = async (param: IdParamDto): Promise<void> => {
    await axiosInstance.delete<void>(`${endpoint}/logout/${param.id}`);
}
