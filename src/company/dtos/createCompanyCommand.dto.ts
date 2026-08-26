import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { IsValidCnpj } from '../../validators/isValidCnpj.validator';

export class CreateCompanyCommandDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @IsValidCnpj()
    document!: string;

    @IsString()
    @IsOptional()
    description?: string | null;
}
