import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateBatchCommandDto {
    @Min(1)
    @IsInt()
    @ApiProperty({ example: 1 })
    companyId!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({ example: "Awesome Company Ltd" })
    name!: string;
}
