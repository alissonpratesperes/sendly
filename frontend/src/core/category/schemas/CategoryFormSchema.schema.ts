import { z } from 'zod';

export const CategoryFormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().nonempty('A categoria do produto é obrigatória').refine((inputValue) => inputValue.trim().length > 0, { message: "A categoria do produto não pode conter apenas espaços" }).max(80, 'A categoria do produto não pode ter mais que 80 caracteres'),
    ativo: z.boolean().default(true)
});

export type CategoryFormData = z.infer<typeof CategoryFormSchema>;