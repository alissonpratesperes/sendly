import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportContactCommandDto {
    @Min(1)
    @IsInt()
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    listId!: number;
}
