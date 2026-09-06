import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayUnique, IsArray, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

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

    @Min(1)
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 10 })
    templateId!: number;

    @IsArray()
    @ArrayUnique()
    @ArrayMaxSize(15)
    @IsInt({ each: true })
    @Min(1, { each: true })
    @ApiProperty({ example: [1, 2, 3, 4] })
    contactIds!: number[];
}
