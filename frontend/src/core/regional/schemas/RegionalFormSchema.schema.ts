import { z } from 'zod';

export const RegionalFormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().nonempty('O nome da regional é obrigatório').refine((inputValue) => inputValue.trim().length > 0, { message: "O nome não pode conter apenas espaços" }).max(100, 'O nome não pode ter mais que 100 caracteres'),
    ativo: z.boolean().default(true)
});

export type RegionalFormData = z.infer<typeof RegionalFormSchema>;