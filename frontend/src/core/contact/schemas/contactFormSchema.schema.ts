import { z } from 'zod';
import { CountryCode, getCountries } from 'libphonenumber-js';

export const ContactFormSchema = z.object({
    id: z
        .number()
        .optional(),

    companyId: z
        .number(),

    listId: z
        .number()
        .positive("A lista é obrigatória"),

    name: z
        .string()
        .nonempty("O nome é obrigatório")
        .refine((inputValue) => inputValue.trim().length > 0, { message: "O nome não pode conter apenas espaços" })
        .max(150, "O nome não pode ter mais que 150 caracteres"),

    phone: z
        .string()
        .nonempty("O telefone é obrigatório")
        .refine((inputValue) => inputValue.trim().length > 0, { message: "O telefone não pode conter apenas espaços" })
        .max(20, "O telefone não pode ter mais que 20 caracteres"),

    country: z
        .string()
        .nonempty("O país é obrigatório")
        .length(2, "O país deve possuir 2 caracteres")
        .refine((country) => getCountries().includes(country as CountryCode), { message: "O país selecionado é inválido" })
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
