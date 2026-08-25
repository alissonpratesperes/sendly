import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ResetDto {
    @IsNotEmpty()
    @IsString()
    @Length(8)
    newPassword: string = "";

    @IsNotEmpty()
    @IsString()
    @Length(8)
    confirmPassword: string = "";
}
