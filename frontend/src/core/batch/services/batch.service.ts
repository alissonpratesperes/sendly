import { BatchResponseDto } from '../dtos/batchResponse.dto';
import { IdParamDto } from '../../../shared/dtos/idParam.dto';
import { BatchSendResponseDto } from '../dtos/batchSendResponse.dto';
import { CreateBatchCommandDto } from '../dtos/createBatchCommand.dto';
import axiosInstance from '../../../core/authentication/interceptors/authorization.interceptor';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { PaginatedResponseDto } from '../../../shared/components/paginate/dtos/paginatedResponse.dto';

const BASE_ENDPOINT: string = "batch";

export const Create = async (command: CreateBatchCommandDto): Promise<BatchResponseDto> => {
    const { data } = await axiosInstance.post<BatchResponseDto>(BASE_ENDPOINT, command);

    return data;
}

export const List = async (query: PaginatedQueryDto): Promise<PaginatedResponseDto<BatchResponseDto>> => {
    const { data } = await axiosInstance.get<PaginatedResponseDto<BatchResponseDto>>(BASE_ENDPOINT, { params: query, });

    return data;
}

export const ListSends = async (param: IdParamDto, query: PaginatedQueryDto): Promise<PaginatedResponseDto<BatchSendResponseDto>> => {
    const { data } = await axiosInstance.get<PaginatedResponseDto<BatchSendResponseDto>>(`${ BASE_ENDPOINT }/${ param.id }/sends`, { params: query, });

    return data;
}
