import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsObject, IsString, MaxLength, Min } from 'class-validator';

export class CreateTemplateCommandDto {
    @Min(1)
    @IsInt()
    @ApiProperty({ example: 1 })
    companyId!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({ example: "Flash September Sale" })
    name!: string;

    @IsObject()
    @IsNotEmpty()
    @ApiProperty({ example: {
        header: {
            title: "Flash September Sale",
            image: "https://example.com/image.jpg",
        },
        body: {
            content: "Welcome to our September Sale! Exclusive discounts on our products.",
        },
        footer: {
            text: "Valid until September 30, 2024. Terms and conditions apply.",
        },
    } })
    content!: Prisma.InputJsonValue;
}
