import { BatchSend_Status } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

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
    @ApiPropertyOptional({ example: 15 })
    limit: number = 15;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @ApiPropertyOptional({ example: "Any wanted search text..." })
    search?: string;

    @Min(1)
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @ApiPropertyOptional({ example: 39 })
    listId?: number;

    @Min(1)
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @ApiPropertyOptional({ example: 17 })
    templateId?: number;

    @IsEnum(BatchSend_Status)
    @IsOptional()
    @ApiPropertyOptional({ enum: BatchSend_Status })
    status?: BatchSend_Status;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === "true") { return true; }
        if (value === "false") { return false; }

        return value;
    })
    @ApiPropertyOptional({ example: true })
    active?: boolean;

    @Min(1)
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @ApiPropertyOptional({ example: 1 })
    companyId?: number;
}
