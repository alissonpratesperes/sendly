import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotCommandDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: "john.doe@mail.com" })
    email: string = "";
}
