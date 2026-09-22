import { z } from 'zod';

export const ListFormSchema = z.object({
    id: z
        .optional()
        .number()
        .int(),

    companyId: z
        .number()
        .int(),

    name: z
        .string()
        .nonempty("O nome é obrigatório")
        .refine((inputValue) => inputValue.trim().length > 0, { message: "O nome não pode conter apenas espaços" })
        .max(150, "O nome não pode ter mais que 150 caracteres"),

    subject: z
        .string()
        .nonempty("O assunto é obrigatório")
        .refine((inputValue) => inputValue.trim().length > 0, { message: "O assunto não pode conter apenas espaços" })
        .max(255, "O assunto não pode ter mais que 255 caracteres"),

    color: z
        .string()
        .nonempty("A cor é obrigatória")
        .refine((inputValue) => inputValue.trim().length > 0, { message: "A cor não pode conter apenas espaços" })
        .max(7, "A cor não pode ter mais que 7 caracteres"),
});

export type ListFormData = z.infer<typeof ListFormSchema>;
