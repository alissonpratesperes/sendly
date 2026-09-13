import { UserResponseDto } from '../dtos/userResponse.dto';
import { IdParamDto } from '../../../shared/dtos/idParam.dto';
import { CreateUserCommandDto } from '../dtos/createUserCommand.dto';
import { UpdateUserCommandDto } from '../dtos/updateUserCommand.dto';
import axiosInstance from '../../authentication/interceptors/authorization.interceptor';
import { PaginatedQueryDto } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';
import { PaginatedResponseDto } from '../../../shared/components/pagination/dtos/PaginatedResponseDTO.dto';

const endpoint = "user";

export const Create = async (command: CreateUserCommandDto): Promise<UserResponseDto> => {
    const { data } = await axiosInstance.post<UserResponseDto>(endpoint, command);

    return data;
}

export const Read = async (param: IdParamDto): Promise<UserResponseDto> => {
    const { data } = await axiosInstance.get<UserResponseDto>(`${endpoint}/${param.id}`);

    return data;
}

export const List = async (query: PaginatedQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> => {
    const { data } = await axiosInstance.get<PaginatedResponseDto<UserResponseDto>>(endpoint, { params: query });

    return data;
}

export const Update = async (param: IdParamDto, command: UpdateUserCommandDto): Promise<UserResponseDto> => {
    const { data } = await axiosInstance.patch<UserResponseDto>(`${endpoint}/${param.id}`, command);

    return data;
}

export const Delete = async (param: IdParamDto): Promise<void> => {
    await axiosInstance.delete<void>(`${endpoint}/${param.id}`);
}
