import { z } from 'zod';

export const CompanyFormSchema = z.object({
    id: z
        .optional()
        .number()
        .int(),

    name: z
        .string()
        .nonempty("O nome é obrigatório")
        .refine((inputValue) => inputValue.trim().length > 0, { message: "O nome não pode conter apenas espaços" })
        .max(150, "O nome não pode ter mais que 150 caracteres"),

    document: z
        .string()
        .nonempty("O cnpj é obrigatório")
        .refine((inputValue) => inputValue.trim().length > 0, { message: "O cnpj não pode conter apenas espaços" })
        .max(14, "O cnpj não pode ter mais que 14 caracteres"),

    description: z
        .string()
        .optional(),
});

export type CompanyFormData = z.infer<typeof CompanyFormSchema>;
