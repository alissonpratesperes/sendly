import * as path from 'path';
import * as fs from 'fs/promises';
import { BadRequestException } from '@nestjs/common';

import { ParsedTemplate } from '../interfaces/parsedTemplate.interface';
import { requireEnvironmentVariable } from 'src/common/utils/requireEnvironmentVariable.util';

export async function imagePathToContent(content: ParsedTemplate, image?: Express.Multer.File): Promise<ParsedTemplate> {
    const imageBlock = content.body.find(block => block.type === "image");

    if (!imageBlock) {
        if (image) {
            throw new BadRequestException("Template does not contain an image block");
        }

        return content;
    }
    if (imageBlock.path && !image) {
        return content;
    }
    if (!imageBlock.path && !image) {
        throw new BadRequestException("Image file is required when template contains an image");
    }
    if (!image) {
        throw new BadRequestException("Image file is required when template contains an image");
    }

    const uploadDirectory = path.resolve(process.cwd(), "uploads");
    const fileExtension = path.extname(image.originalname).toLowerCase();
    const uniqueSuffix = `${ Date.now() } - ${ Math.round(Math.random() * 1e9) }`;
    const filename = `${ image.fieldname } - ${ uniqueSuffix}${fileExtension }`;
    const filePath = path.join(uploadDirectory, filename);

    await fs.mkdir(uploadDirectory, { recursive: true });
    await fs.writeFile(filePath, image.buffer);

    imageBlock.path = `${ requireEnvironmentVariable("BASE_URL") }/uploads/${ filename }`;

    return content;
}
