import { TemplateFormData } from '../schemas/templateFormSchema.schema';

export interface TemplateResponseDto {
    id: number;
    companyId: number;

    name: string;
    content: TemplateFormData["content"];

    createdAt: string;
    updatedAt: string;
}
