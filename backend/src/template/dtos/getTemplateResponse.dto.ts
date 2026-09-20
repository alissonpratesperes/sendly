import { ParsedTemplate } from '../interfaces/parsedTemplate.interface';

export class GetTemplateResponseDto {
    constructor(
        public id: number,
        public companyId: number,

        public name: string,
        public content: ParsedTemplate,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
