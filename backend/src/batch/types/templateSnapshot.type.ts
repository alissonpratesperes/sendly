import { Prisma } from '@prisma/client';

export type TemplateSnapshot = {
    id: number;
    name: string;
    content: Prisma.InputJsonValue;
}
