import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserParamDto {
    @Min(1)
    @IsInt()
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    id!: number;
}
