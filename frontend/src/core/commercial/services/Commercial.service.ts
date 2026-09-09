import { CommercialDTO } from '../dtos/CommercialDTO.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';
import { PaginatedResponseDTO } from '../../../shared/components/pagination/dtos/PaginatedResponseDTO.dto';

const endpoint = "acao";

export const Create = (commercial: FormData) => {
    return axiosInstance.post(endpoint, commercial, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const Read = async (paginatedRequest: PaginatedRequestDTO): Promise<PaginatedResponseDTO<CommercialDTO>> => {
    const { page, pageSize, sortBy, sortDir, search, ...filtersBody } = paginatedRequest;
    const response = await axiosInstance.post(`${endpoint}/All`, filtersBody, { params: { page, pageSize, sortBy, sortDir, search } });

    return response.data;
};
export const ReadById = async (id: number): Promise<CommercialDTO> => {
    const response = await axiosInstance.get<CommercialDTO>(`${endpoint}/${id}`, { params: { bringBase64Image: true } });

    return response.data;
};
export const Update = async (id: number, commercial: FormData) => {
    await axiosInstance.put<CommercialDTO>(`${endpoint}/${id}`, commercial, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const Delete = async (id: number) => {
    await axiosInstance.delete<void>(`${endpoint}/${id}`);
};