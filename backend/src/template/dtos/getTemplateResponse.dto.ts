import { Prisma } from '@prisma/client';

export class GetTemplateResponseDto {
    constructor(
        public id: number,
        public companyId: number,

        public name: string,
        public content: Prisma.JsonValue,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
