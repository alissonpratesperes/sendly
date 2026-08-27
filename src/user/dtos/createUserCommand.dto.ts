import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateUserCommandDto {
    @Min(1)
    @IsInt()
    @ApiProperty({ example: 1 })
    companyId!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({ example: "John Doe" })
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty({ example: "john.doe@mail.com" })
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(255)
    @ApiProperty({ example: "mYpAsSwOrD@123" })
    password!: string;
}
