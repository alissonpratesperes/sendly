import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

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
}
