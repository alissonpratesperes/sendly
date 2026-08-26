import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListCompanyQueryDto {
    @Min(1)
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    page: number = 1;

    @Min(1)
    @IsInt()
    @Max(100)
    @IsOptional()
    @Type(() => Number)
    limit: number = 10;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    search?: string;
}
