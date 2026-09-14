import { CommercialDTO } from '../dtos/CommercialDTO.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { PaginatedResponseDto } from '../../../shared/components/paginate/dtos/paginatedResponse.dto';

const endpoint = "acao";

export const Create = (commercial: FormData) => {
    return axiosInstance.post(endpoint, commercial, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const Read = async (paginatedRequest: PaginatedQueryDto): Promise<PaginatedResponseDto<CommercialDTO>> => {
    const { page, limit: pageSize, search } = paginatedRequest;
    const response = await axiosInstance.post(`${endpoint}/All`, { params: { page, pageSize, search } });

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