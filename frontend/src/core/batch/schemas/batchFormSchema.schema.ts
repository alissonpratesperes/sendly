import { z } from 'zod';

export const BatchFormSchema = z.object({
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

    templateId: z
        .number()
        .int()
        .positive("O template é obrigatório"),

    listId: z
        .number()
        .positive("A lista é obrigatória"),
});

export type BatchFormData = z.infer<typeof BatchFormSchema>;
