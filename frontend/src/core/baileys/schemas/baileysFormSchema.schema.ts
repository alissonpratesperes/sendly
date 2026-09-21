import { z } from 'zod';
import { CountryCode, getCountries } from 'libphonenumber-js';

const countries = getCountries();

export const BaileysFormSchema = z.object({
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

export type BaileysFormData = z.infer<typeof BaileysFormSchema>;
