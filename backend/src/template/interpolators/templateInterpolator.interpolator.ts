import { Injectable } from '@nestjs/common';

import { ParsedTemplate } from '../interfaces/parsedTemplate.interface';

@Injectable()
export class TemplateInterpolator {
    private interpolateText(text: string, name: string): string {
        return text.replace(/\{\{name\}\}/g, name);
    }

    interpolate(template: ParsedTemplate, name: string): ParsedTemplate {
        return {
            ...template,

            header: template.header
                ? {
                    ...template.header,

                    title: this.interpolateText(template.header.title, name),
                } : undefined,

            body: template.body.map((block) => {
                if (block.type === "text") {
                    return {
                        ...block,

                        text: this.interpolateText(block.text, name),
                    };
                }

                return block;
            }),

            footer: template.footer
                ? {
                    ...template.footer,

                    text: this.interpolateText(template.footer.text, name),
                } : undefined,
        };
    }
}
