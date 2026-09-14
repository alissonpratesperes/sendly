import { ActionDTO } from '../dtos/ActionDTO.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';
import { PaginatedRequestDTO } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { PaginatedResponseDTO } from '../../../shared/components/paginate/dtos/paginatedResponse.dto';

const endpoint = "tipoAcao";

export const Create = async (action: ActionDTO) => {
    await axiosInstance.post<ActionDTO>(endpoint, action);
};
export const Read = async (paginatedRequest: PaginatedRequestDTO): Promise<PaginatedResponseDTO<ActionDTO>> => {
    const response = await axiosInstance.get(endpoint, { params: paginatedRequest });

    return response.data;
};
export const ReadById = async (id: number): Promise<ActionDTO> => {
    const response = await axiosInstance.get<ActionDTO>(`${endpoint}/${id}`);

    return response.data;
};
export const Update = async (id: number, action: ActionDTO) => {
    await axiosInstance.put<ActionDTO>(`${endpoint}/${id}`, action);
};
export const Delete = async (id: number) => {
    await axiosInstance.delete<void>(`${endpoint}/${id}`);
};