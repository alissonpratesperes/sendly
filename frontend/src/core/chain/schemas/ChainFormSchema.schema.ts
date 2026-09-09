import { z } from 'zod';

export const ChainFormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().nonempty('O nome da rede é obrigatório').refine((inputValue) => inputValue.trim().length > 0, { message: "O nome não pode conter apenas espaços" }).max(80, 'O nome não pode ter mais que 80 caracteres'),
    ativo: z.boolean().default(true)
});

export type ChainFormData = z.infer<typeof ChainFormSchema>;