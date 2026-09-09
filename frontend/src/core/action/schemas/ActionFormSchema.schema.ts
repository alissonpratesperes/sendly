import { z } from 'zod';

export const ActionFormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().nonempty('O nome do tipo de ação é obrigatório').refine((inputValue) => inputValue.trim().length > 0, { message: "O nome não pode conter apenas espaços" }).max(80, 'O nome não pode ter mais que 80 caracteres'),
    ativo: z.boolean().default(true)
});

export type ActionFormData = z.infer<typeof ActionFormSchema>;