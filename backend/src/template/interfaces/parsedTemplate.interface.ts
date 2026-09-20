import { TemplateBlock } from '../types/templateBlock.type';

export interface ParsedTemplate {
    header?: {
        title: string;
    };
    body: TemplateBlock[];
    footer?: {
        text: string;
    };
}
