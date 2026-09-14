import { IdParamDto } from '../../../shared/dtos/idParam.dto';
import { CompanyResponseDto } from '../dtos/companyResponse.dto';
import { CreateCompanyCommandDto } from '../dtos/createCompanyCommand.dto';
import { UpdateCompanyCommandDto } from '../dtos/updateCompanyCommand.dto';
import axiosInstance from '../../../core/authentication/interceptors/authorization.interceptor';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { PaginatedResponseDto } from '../../../shared/components/paginate/dtos/paginatedResponse.dto';

const endpoint = "company";

export const Create = async (command: CreateCompanyCommandDto): Promise<CompanyResponseDto> => {
    const { data } = await axiosInstance.post<CompanyResponseDto>(endpoint, command);

    return data;
}

export const Read = async (param: IdParamDto): Promise<CompanyResponseDto> => {
    const { data } = await axiosInstance.get<CompanyResponseDto>(`${endpoint}/${param.id}`);

    return data;
}

export const List = async (query: PaginatedQueryDto): Promise<PaginatedResponseDto<CompanyResponseDto>> => {
    const { data } = await axiosInstance.get<PaginatedResponseDto<CompanyResponseDto>>(endpoint, { params: query });

    return data;
}

export const Update = async (param: IdParamDto, command: UpdateCompanyCommandDto): Promise<CompanyResponseDto> => {
    const { data } = await axiosInstance.patch<CompanyResponseDto>(`${endpoint}/${param.id}`, command);

    return data;
}

export const Delete = async (param: IdParamDto): Promise<void> => {
    await axiosInstance.delete<void>(`${endpoint}/${param.id}`);
}
