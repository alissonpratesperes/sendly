import { ListResponseDto } from '../dtos/listResponse.dto';
import { IdParamDto } from '../../../shared/dtos/idParam.dto';
import { CreateListCommandDto } from '../dtos/createListCommand.dto';
import { UpdateListCommandDto } from '../dtos/updateListCommand.dto';
import axiosInstance from '../../../core/authentication/interceptors/authorization.interceptor';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { PaginatedResponseDto } from '../../../shared/components/paginate/dtos/paginatedResponse.dto';

const endpoint = "list";

export const Create = async (command: CreateListCommandDto): Promise<ListResponseDto> => {
    const { data } = await axiosInstance.post<ListResponseDto>(endpoint, command);

    return data;
}

export const Read = async (param: IdParamDto): Promise<ListResponseDto> => {
    const { data } = await axiosInstance.get<ListResponseDto>(`${endpoint}/${param.id}`);

    return data;
}

export const List = async (query: PaginatedQueryDto): Promise<PaginatedResponseDto<ListResponseDto>> => {
    const { data } = await axiosInstance.get<PaginatedResponseDto<ListResponseDto>>(endpoint, { params: query });

    return data;
}

export const Update = async (param: IdParamDto, command: UpdateListCommandDto): Promise<ListResponseDto> => {
    const { data } = await axiosInstance.patch<ListResponseDto>(`${endpoint}/${param.id}`, command);

    return data;
}

export const Delete = async (param: IdParamDto): Promise<void> => {
    await axiosInstance.delete<void>(`${endpoint}/${param.id}`);
}
