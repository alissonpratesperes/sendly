import { z } from 'zod';

const TemplateHeaderSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "O texto do cabeçalho deve conter texto"),
}).strict();

const TemplateTextBlockSchema = z.object({
    type: z
        .literal("text"),
    text: z
        .string()
        .trim()
        .min(1, "O bloco de texto deve conter texto"),
}).strict();

const TemplateImageBlockSchema = z.object({
    type: z
        .literal("image"),
    path: z
        .string()
        .trim()
}).strict();

const TemplateBlockSchema = z.discriminatedUnion("type", [
    TemplateTextBlockSchema,
    TemplateImageBlockSchema,
]);

const TemplateFooterSchema = z.object({
    text: z
        .string()
        .trim()
        .min(1, "O texto do rodapé deve conter texto"),
}).strict();

export const TemplateContentSchema = z.object({
    header: TemplateHeaderSchema
        .optional(),

    body: z
        .array(TemplateBlockSchema)
        .min(1, "O conteúdo deve possuir pelo menos um bloco")
        .refine(blocks => blocks.some(block => block.type === "text"), "O template deve possuir pelo menos um bloco de texto")
        .refine(blocks => blocks.filter(block => block.type === "image").length <= 1, "O template pode conter apenas uma imagem"),

    footer: TemplateFooterSchema
        .optional(),
});
