import * as path from 'path';
import * as fs from 'fs/promises';
import { BadRequestException } from '@nestjs/common';

import { ParsedTemplate } from '../interfaces/parsedTemplate.interface';

export async function imagePathToContent(content: ParsedTemplate, file?: Express.Multer.File): Promise<ParsedTemplate> {
    const imageBlock = content.body.find(block => block.type === "image");

    if (imageBlock && !file) {
        throw new BadRequestException("Image file is required when template contains an image");
    }
    if (!imageBlock && file) {
        throw new BadRequestException("Template does not contain an image block");
    }
    if (!imageBlock || !file) {
        return content;
    }

    const uploadDirectory = path.resolve(process.cwd(), "uploads");
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    const filePath = path.join(uploadDirectory, filename);

    await fs.mkdir(uploadDirectory, { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    imageBlock.path = filePath;

    return content;
}
