import { ChainDTO } from '../dtos/ChainDTO.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { PaginatedResponseDto } from '../../../shared/components/paginate/dtos/paginatedResponse.dto';
const endpoint = "rede";

export const Create = async (chain: ChainDTO) => {
    await axiosInstance.post<ChainDTO>(endpoint, chain);
};
export const Read = async (paginatedRequest: PaginatedQueryDto): Promise<PaginatedResponseDto<ChainDTO>> => {
    const response = await axiosInstance.get(endpoint, { params: paginatedRequest });

    return response.data;
};
export const ReadById = async (id: number): Promise<ChainDTO> => {
    const response = await axiosInstance.get<ChainDTO>(`${endpoint}/${id}`);

    return response.data;
};
export const Update = async (id: number, chain: ChainDTO) => {
    await axiosInstance.put<ChainDTO>(`${endpoint}/${id}`, chain);
};
export const Delete = async (id: number) => {
    await axiosInstance.delete<void>(`${endpoint}/${id}`);
};