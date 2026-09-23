import { z } from 'zod';

import { TemplateContentSchema } from './templateContentFormSchema.schema';

export const TemplateFormSchema = z.object({
    id: z
        .number()
        .int()
        .optional(),

    companyId: z
        .number()
        .int(),

    name: z
        .string()
        .nonempty("O nome é obrigatório")
        .refine((inputValue) => inputValue.trim().length > 0, { message: "O nome não pode conter apenas espaços" })
        .max(150, "O nome não pode ter mais que 150 caracteres"),

    content: TemplateContentSchema,
});

export type TemplateFormData = z.infer<typeof TemplateFormSchema>;
