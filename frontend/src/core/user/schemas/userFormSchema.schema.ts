import { z } from 'zod';

export const UserFormSchema = z.object({
    id: z
        .number()
        .optional(),

    name: z
        .string()
        .nonempty("O nome é obrigatório")
        .refine((inputValue) => inputValue.trim().length > 0, { message: "O nome não pode conter apenas espaços" })
        .max(150, "O nome não pode ter mais que 150 caracteres"),

    email: z
        .email("Informe um e-mail válido")
        .nonempty("O e-mail é obrigatório")
        .refine((inputValue) => inputValue
        .trim().length > 0, { message: "O email não pode conter apenas espaços" })
        .max(50, "O e-mail não pode ter mais que 50 caracteres"),
});

export type UserFormData = z.infer<typeof UserFormSchema>;
