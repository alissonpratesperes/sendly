import { IdParamDto } from '../../../shared/dtos/idParam.dto';
import { TemplateResponseDto } from '../dtos/templateResponse.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { PaginatedResponseDto } from '../../../shared/components/paginate/dtos/paginatedResponse.dto';

const BASE_ENDPOINT: string = "template";

export const Create = async (formData: FormData): Promise<TemplateResponseDto> => {
    const { data } = await axiosInstance.post<TemplateResponseDto>(BASE_ENDPOINT, formData);

    return data;
}

export const Read = async (param: IdParamDto): Promise<TemplateResponseDto> => {
    const { data } = await axiosInstance.get<TemplateResponseDto>(`${ BASE_ENDPOINT }/${ param.id }`);

    return data;
}

export const List = async (query: PaginatedQueryDto): Promise<PaginatedResponseDto<TemplateResponseDto>> => {
    const { data } = await axiosInstance.get<PaginatedResponseDto<TemplateResponseDto>>(BASE_ENDPOINT, { params: query });

    return data;
}

export const Update = async (param: IdParamDto, formData: FormData): Promise<TemplateResponseDto> => {
    const { data } = await axiosInstance.patch<TemplateResponseDto>(`${ BASE_ENDPOINT }/${ param.id }`, formData);

    return data;
}

export const Delete = async (param: IdParamDto): Promise<void> => {
    await axiosInstance.delete<void>(`${ BASE_ENDPOINT }/${ param.id }`);
}
