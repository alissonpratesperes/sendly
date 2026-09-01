import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginCommandDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: "john.doe@mail.com" })
    email: string = "";

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "mypassword@123" })
    password: string = "";
}
