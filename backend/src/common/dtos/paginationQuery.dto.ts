import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
    @Min(1)
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @ApiPropertyOptional({ example: 1 })
    page: number = 1;

    @Min(1)
    @IsInt()
    @Max(100)
    @IsOptional()
    @Type(() => Number)
    @ApiPropertyOptional({ example: 10 })
    limit: number = 10;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @ApiPropertyOptional({ example: "Any wanted search text..." })
    search?: string;
}
