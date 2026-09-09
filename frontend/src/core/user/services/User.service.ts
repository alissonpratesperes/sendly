import { UserDTO } from '../dtos/UserDTO.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';
import { PaginatedResponseDTO } from '../../../shared/components/pagination/dtos/PaginatedResponseDTO.dto';

const endpoint = "usuario";

export const Create = async (user: UserDTO) => {
    await axiosInstance.post<UserDTO>(endpoint, user);
};
export const Read = async (paginatedRequest: PaginatedRequestDTO): Promise<PaginatedResponseDTO<UserDTO>> => {
    const response = await axiosInstance.get(endpoint, { params: paginatedRequest });

    return response.data;
};
export const ReadById = async (id: number, firstAccessTokenNotLocalStoredForGetUserInformation?: string): Promise<UserDTO> => {
    const response = await axiosInstance.get<UserDTO>(`${endpoint}/${id}`, { headers: firstAccessTokenNotLocalStoredForGetUserInformation ? { Authorization: `Bearer ${firstAccessTokenNotLocalStoredForGetUserInformation}` } : {} });

    return response.data;
};
export const Update = async (id: number, user: UserDTO) => {
    await axiosInstance.put<UserDTO>(`${endpoint}/${id}`, user);
};
export const Delete = async (id: number) => {
    await axiosInstance.delete<void>(`${endpoint}/${id}`);
};