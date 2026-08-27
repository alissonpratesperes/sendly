import { GetUserResponseDto } from '../dtos/getUserResponse.dto';
import { UserWithRelations } from '../types/userWithRelations.type';
import { toCompanyResponseMapper } from '../../company/mappers/toCompanyResponse.mapper';

export function toUserResponseMapper(userWithRelations: UserWithRelations): GetUserResponseDto {
    return new GetUserResponseDto(
        userWithRelations.Id,

        toCompanyResponseMapper(userWithRelations.Company),

        userWithRelations.Name,
        userWithRelations.Email,



        userWithRelations.IsFirstAccess,
        userWithRelations.IsSystemRoot,

        userWithRelations.CreatedAt,
        userWithRelations.UpdatedAt,
    );
}

