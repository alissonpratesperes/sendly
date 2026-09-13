import { RegionalDTO } from '../dtos/RegionalDTO.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';
import { PaginatedResponseDTO } from '../../../shared/components/pagination/dtos/PaginatedResponseDTO.dto';

const endpoint = "user";

export const Create = async (regional: RegionalDTO) => {
    await axiosInstance.post<RegionalDTO>(endpoint, regional);
};
export const Read = async (paginatedRequest: PaginatedRequestDTO): Promise<PaginatedResponseDTO<RegionalDTO>> => {
    const response = await axiosInstance.get(endpoint, { params: paginatedRequest });

    return response.data;
};
export const ReadById = async (id: number): Promise<RegionalDTO> => {
    const response = await axiosInstance.get<RegionalDTO>(`${endpoint}/${id}`);

    return response.data;
};
export const Update = async (id: number, regional: RegionalDTO) => {
    await axiosInstance.put<RegionalDTO>(`${endpoint}/${id}`, regional);
};
export const Delete = async (id: number) => {
    await axiosInstance.delete<void>(`${endpoint}/${id}`);
};