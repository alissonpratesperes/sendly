import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetCompanyParamDto {
    @Min(1)
    @IsInt()
    @Type(() => Number)
    id!: number;
}
