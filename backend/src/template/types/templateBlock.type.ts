import { TemplateTextBlock } from './templateTextBlock.type';
import { TemplateImageBlock } from './templateImageBlock.type';

export type TemplateBlock = | TemplateTextBlock | TemplateImageBlock;
