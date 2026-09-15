import { IdParamDto } from '../../../shared/dtos/idParam.dto';
import { ContactResponseDto } from '../dtos/contactResponse.dto';
import { CreateContactCommandDto } from '../dtos/createContactCommand.dto';
import { UpdateContactCommandDto } from '../dtos/updateContactCommand.dto';
import axiosInstance from '../../../core/authentication/interceptors/authorization.interceptor';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { PaginatedResponseDto } from '../../../shared/components/paginate/dtos/paginatedResponse.dto';

const endpoint = "contact";

export const Create = async (command: CreateContactCommandDto): Promise<ContactResponseDto> => {
    const { data } = await axiosInstance.post<ContactResponseDto>(endpoint, command);

    return data;
}

export const Read = async (param: IdParamDto): Promise<ContactResponseDto> => {
    const { data } = await axiosInstance.get<ContactResponseDto>(`${endpoint}/${param.id}`);

    return data;
}

export const List = async (query: PaginatedQueryDto): Promise<PaginatedResponseDto<ContactResponseDto>> => {
    const { data } = await axiosInstance.get<PaginatedResponseDto<ContactResponseDto>>(endpoint, { params: query });

    return data;
}

export const Update = async (param: IdParamDto, command: UpdateContactCommandDto): Promise<ContactResponseDto> => {
    const { data } = await axiosInstance.patch<ContactResponseDto>(`${endpoint}/${param.id}`, command);

    return data;
}

export const Delete = async (param: IdParamDto): Promise<void> => {
    await axiosInstance.delete<void>(`${endpoint}/${param.id}`);
}
