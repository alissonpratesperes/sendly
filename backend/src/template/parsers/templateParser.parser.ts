import { BadRequestException, Injectable } from '@nestjs/common';

import { TemplateBlock } from '../types/templateBlock.type';
import { ParsedTemplate } from '../interfaces/parsedTemplate.interface';

@Injectable()
export class TemplateParser {
    private parseContent(content: string | ParsedTemplate): ParsedTemplate {
        if (typeof content !== "string") {
            return content;
        }

        let parsedContent: unknown;

        try {
            parsedContent = JSON.parse(content);
        } catch (error) {
            throw new BadRequestException("Invalid template content", { cause: error, });
        }

        if (typeof parsedContent !== "object" || parsedContent === null || Array.isArray(parsedContent)) {
            throw new BadRequestException("Template content must be an object");
        }

        return parsedContent as ParsedTemplate;
    }

    private validateProperties(value: object, allowedProperties: string[], message: string): void {
        for (const property of Object.keys(value)) {
            if (!allowedProperties.includes(property)) {
                throw new BadRequestException(message);
            }
        }
    }

    private validateHeader(header: ParsedTemplate["header"]): void {
        if (header === undefined) {
            return;
        }
        if (typeof header !== "object" || header === null || Array.isArray(header)) {
            throw new BadRequestException("Template header must be an object");
        }

        this.validateProperties(header, ["title"], "Template header contains invalid properties");

        if (typeof header.title !== "string" || !header.title.trim()) {
            throw new BadRequestException("Template header title must contain text");
        }
    }

    private validateBody(content: ParsedTemplate): void {
        if (!Array.isArray(content.body)) {
            throw new BadRequestException("Template body must be an array");
        }

        let imageCount = 0;
        let hasTextBlock = false;

        for (const block of content.body) {
            this.validateBlock(block);

            if (block.type === "text") {
                hasTextBlock = true;
            }
            if (block.type === "image") {
                imageCount++;
            }
        }
        if (!hasTextBlock) {
            throw new BadRequestException("Template body must contain at least one text block");
        }
        if (imageCount > 1) {
            throw new BadRequestException("Template can contain only one image");
        }
    }

    private validateFooter(footer: ParsedTemplate["footer"]): void {
        if (footer === undefined) {
            return;
        }
        if (typeof footer !== "object" || footer === null || Array.isArray(footer)) {
            throw new BadRequestException("Template footer must be an object");
        }

        this.validateProperties(footer, ["text"], "Template footer contains invalid properties");

        if (typeof footer.text !== "string" || !footer.text.trim()) {
            throw new BadRequestException("Template footer text must contain text");
        }
    }
    private validateBlock(block: unknown): void {
        if (typeof block !== "object" || block === null || Array.isArray(block)) {
            throw new BadRequestException("Invalid template block");
        }

        const templateBlock = block as TemplateBlock;

        if (templateBlock.type === "text") {
            this.validateProperties(block, ["type", "text"], "Text block contains invalid properties");

            if (typeof templateBlock.text !== "string" || !templateBlock.text.trim()) {
                throw new BadRequestException("Text block must contain text");
            }

            return;
        }
        if (templateBlock.type === "image") {
            this.validateProperties(block, ["type", "path"], "Image block contains invalid properties");

            if (typeof templateBlock.path !== "string" || !templateBlock.path.trim()) {
                throw new BadRequestException("Image block must contain a valid path");
            }

            return;
        }

        throw new BadRequestException("Invalid template block type");
    }

    parse(content: string | ParsedTemplate): ParsedTemplate {
        const parsedContent = this.parseContent(content);

        this.validateHeader(parsedContent.header);
        this.validateBody(parsedContent);
        this.validateFooter(parsedContent.footer);

        return parsedContent;
    }
}
