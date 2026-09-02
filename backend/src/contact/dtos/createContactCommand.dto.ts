import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsISO31661Alpha2, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateContactCommandDto {
    @Min(1)
    @IsInt()
    @ApiProperty({ example: 1 })
    companyId!: number;

    @Min(1)
    @IsInt()
    @ApiProperty({ example: 1 })
    listId!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({ example: "Jane Doe" })
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @ApiProperty({ example: "+5554900001111" })
    phone!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(2)
    @IsISO31661Alpha2()
    @ApiProperty({ example: "BR" })
    country!: string;
}
