import { StoreDTO } from '../dtos/StoreDTO.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';
import { PaginatedResponseDTO } from '../../../shared/components/pagination/dtos/PaginatedResponseDTO.dto';

const endpoint = "loja";

export const Create = async (store: StoreDTO) => {
    await axiosInstance.post<StoreDTO>(endpoint, store);
};
export const Read = async (paginatedRequest: PaginatedRequestDTO): Promise<PaginatedResponseDTO<StoreDTO>> => {
    const response = await axiosInstance.get(endpoint, { params: paginatedRequest });

    return response.data;
};
export const ReadById = async (id: number): Promise<StoreDTO> => {
    const response = await axiosInstance.get<StoreDTO>(`${endpoint}/${id}`);

    return response.data;
};
export const Update = async (id: number, store: StoreDTO) => {
    await axiosInstance.put<StoreDTO>(`${endpoint}/${id}`, store);
};
export const Delete = async (id: number) => {
    await axiosInstance.delete<void>(`${endpoint}/${id}`);
};