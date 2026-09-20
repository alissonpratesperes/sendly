import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePairingCommandDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @ApiProperty({ example: "+5554900001111" })
    phone!: string;
}
