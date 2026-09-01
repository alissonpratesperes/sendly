import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { IsValidCnpj } from '../../common/validators/isValidCnpj.validator';

export class CreateCompanyCommandDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({ example: "Awesome Company Ltd" })
    name!: string;

    @IsString()
    @IsNotEmpty()
    @IsValidCnpj()
    @ApiProperty({ example: "01.101.010/0001-01" })
    document!: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: "An awesome company, with awesome products" })
    description?: string | null;
}
