import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotDto {
    @IsNotEmpty()
    @IsEmail()
    email: string = "";
}
