import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateNoteCommandDto {
    @Min(1)
    @IsInt()
    @ApiProperty({ example: 1 })
    contactId!: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "A note for this contact, to remember to make on Friday a..." })
    content!: string;
}
