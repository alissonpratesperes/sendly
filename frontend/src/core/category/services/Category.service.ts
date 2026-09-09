import { CategoryDTO } from '../dtos/CategoryDTO.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';
import { PaginatedResponseDTO } from '../../../shared/components/pagination/dtos/PaginatedResponseDTO.dto';

const endpoint = "categoriaProduto";

export const Create = async (category: CategoryDTO) => {
    await axiosInstance.post<CategoryDTO>(endpoint, category);
};
export const Read = async (paginatedRequest: PaginatedRequestDTO): Promise<PaginatedResponseDTO<CategoryDTO>> => {
    const response = await axiosInstance.get(endpoint, { params: paginatedRequest });

    return response.data;
};
export const Update = async (id: number, category: CategoryDTO) => {
    await axiosInstance.put<CategoryDTO>(`${endpoint}/${id}`, category);
};
export const Delete = async (id: number) => {
    await axiosInstance.delete<void>(`${endpoint}/${id}`);
};