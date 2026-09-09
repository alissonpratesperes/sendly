import { z } from 'zod';

export const UserFormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().nonempty('O nome é obrigatório').refine((inputValue) => inputValue.trim().length > 0, { message: "O nome não pode conter apenas espaços" }).max(100, 'O nome não pode ter mais que 100 caracteres'),
    email: z.email().nonempty('O E-mail é obrigatório').refine((inputValue) => inputValue.trim().length > 0, { message: "O E-mail não pode conter apenas espaços" }).max(100, 'O E-mail não pode ter mais que 100 caracteres'),
    senha: z.string().optional(),
    regionalId: z.coerce.number().refine(inputValue => inputValue > 0, { message: 'A Regional é obrigatória"' }),
    isAdministrador: z.boolean().default(false),
    ativo: z.boolean().default(true)
});

export type UserFormData = z.infer<typeof UserFormSchema>;