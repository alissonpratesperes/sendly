import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListCompanyQueryDto {
    @Min(1)
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ example: "1" })
    page: number = 1;

    @Min(1)
    @IsInt()
    @Max(100)
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ example: "10" })
    limit: number = 10;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @ApiProperty({ example: "Company xyz 1" })
    search?: string;
}
