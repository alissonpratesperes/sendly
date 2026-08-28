import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Matches, MaxLength, Min } from 'class-validator';

export class CreateListCommandDto {
    @Min(1)
    @IsInt()
    @ApiProperty({ example: 1 })
    companyId!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({ example: "Important" })
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty({ example: "Important contacts to call tomorrow" })
    subject!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(7)
    @Matches(/^#[0-9A-Fa-f]{6}$/)
    @ApiProperty({ example: "#DC143C" })
    color!: string;
}
