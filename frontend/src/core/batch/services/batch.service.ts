import { BatchResponseDto } from '../dtos/batchResponse.dto';
import { IdParamDto } from '../../../shared/dtos/idParam.dto';
import { CreateBatchCommandDto } from '../dtos/createBatchCommand.dto';
import { UpdateBatchCommandDto } from '../dtos/updateBatchCommand.dto';
import axiosInstance from '../../../core/authentication/interceptors/authorization.interceptor';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { PaginatedResponseDto } from '../../../shared/components/paginate/dtos/paginatedResponse.dto';

const BASE_ENDPOINT: string = "batch";

export const Create = async (command: CreateBatchCommandDto): Promise<BatchResponseDto> => {
    const { data } = await axiosInstance.post<BatchResponseDto>(BASE_ENDPOINT, command);

    return data;
}

export const Read = async (param: IdParamDto): Promise<BatchResponseDto> => {
    const { data } = await axiosInstance.get<BatchResponseDto>(`${ BASE_ENDPOINT }/${ param.id }`);

    return data;
}

export const List = async (query: PaginatedQueryDto): Promise<PaginatedResponseDto<BatchResponseDto>> => {
    const { data } = await axiosInstance.get<PaginatedResponseDto<BatchResponseDto>>(BASE_ENDPOINT, { params: query });

    return data;
}

export const Update = async (param: IdParamDto, command: UpdateBatchCommandDto): Promise<BatchResponseDto> => {
    const { data } = await axiosInstance.patch<BatchResponseDto>(`${ BASE_ENDPOINT }/${ param.id }`, command);

    return data;
}

export const Delete = async (param: IdParamDto): Promise<void> => {
    await axiosInstance.delete<void>(`${ BASE_ENDPOINT }/${ param.id }`);
}
