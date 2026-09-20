import { Injectable } from '@nestjs/common';

import { ParsedTemplate } from '../interfaces/parsedTemplate.interface';
import { WhatsAppMessage } from '../../common/types/whatsAppMessage.type';

@Injectable()
export class TemplateBuilder {
    private buildText(template: ParsedTemplate): string {
        const parts: string[] = [];

        this.addHeader(parts, template);
        this.addBody(parts, template);
        this.addFooter(parts, template);

        return parts.join("\n\n");
    }

    private addHeader(parts: string[], template: ParsedTemplate): void {
        const title = template.header?.title;

        if (title) {
            parts.push(`*${title}*`);
        }
    }

    private addBody(parts: string[], template: ParsedTemplate): void {
        for (const block of template.body) {
            if (block.type === "text") {
                parts.push(block.text);
            }
        }
    }

    private addFooter(parts: string[], template: ParsedTemplate): void {
        const footer = template.footer?.text;

        if (footer) {
            parts.push(`_${footer}_`);
        }
    }

    private getImagePath(template: ParsedTemplate): string | undefined {
        return template.body.find(block => block.type === "image")?.path;
    }

    build(template: ParsedTemplate): WhatsAppMessage {
        const text = this.buildText(template);
        const imagePath = this.getImagePath(template);

        if (imagePath) {
            return {
                type: "image",
                text,
                imagePath,
            };
        }

        return {
            type: "text",
            text,
        };
    }
}
