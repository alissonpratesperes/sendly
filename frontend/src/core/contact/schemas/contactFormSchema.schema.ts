import { z } from 'zod';
import { CountryCode, getCountries } from 'libphonenumber-js';

const countries = getCountries();

export const ContactFormSchema = z.object({
    id: z
        .number()
        .int()
        .optional(),

    companyId: z
        .number()
        .int(),

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
        .refine((country) => country === "" || countries.includes(country as CountryCode), "País inválido")
        .transform((country) => country as CountryCode | ""),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
