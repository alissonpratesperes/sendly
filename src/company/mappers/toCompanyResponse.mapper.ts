import { Company } from '@prisma/client';

import { formatCnpj } from 'src/utils/formatCnpj.util';
import { GetCompanyResponseDto } from '../dtos/getCompanyResponse.dto';

export function toCompanyResponseMapper(company: Company): GetCompanyResponseDto {
    return new GetCompanyResponseDto(
        company.Id,
        company.Name,
        formatCnpj(company.Document),
        company.Description,

        company.CreatedAt,
        company.UpdatedAt,
    );
}