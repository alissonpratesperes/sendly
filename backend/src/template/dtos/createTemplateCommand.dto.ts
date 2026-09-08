import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsObject, IsString, MaxLength, Min } from 'class-validator';

import type { TemplateContent } from '../types/templateContent.type';

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

    @IsObject()
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }

        return value;
    })
    @ApiProperty({
        type: "string",
        format: "JSON",
        example: JSON.stringify({
            header: {
                title: "Flash September Sale",
            },
            body: [
                { type: "text", text: "Check our exclusive news", },
                { type: "image", url: "/home/user/sendly/backend/uploads/file-1788832503700-719666894.png", }
            ],
            footer: { text: "Valid until September 30, 2026", },
        })
    })
    content!: TemplateContent;
}
