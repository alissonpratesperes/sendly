import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateTemplateCommandDto {
    @Min(1)
    @IsInt()
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    companyId!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({ example: "Flash September Sale" })
    name!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: "string",
        format: "JSON",
        example: JSON.stringify({
            header: { title: "Flash September Sale", },
            body: [ { type: "text", text: "Check our exclusive news", }, ],
            footer: { text: "Valid until September 30, 2026", },
        })
    })
    content!: string;
}
