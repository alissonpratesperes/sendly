import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ResetCommandDto {
    @Length(8)
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "myNewPassword123" })
    newPassword: string = "";

    @Length(8)
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "myNewPassword123" })
    confirmPassword: string = "";
}
