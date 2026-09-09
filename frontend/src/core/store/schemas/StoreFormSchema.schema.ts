import { z } from 'zod';

export const StoreFormSchema = z.object({
    id: z.number().optional(),
    codigo: z.string().nonempty('Código da loja é obrigatório'),
    razaoSocial: z.string().nonempty('A razão social da loja é obrigatória').refine((inputValue) => inputValue.trim().length > 0, { message: "A razão social não pode conter apenas espaços" }).max(80, 'A razão social não pode ter mais que 80 caracteres'),
    apelido: z.string().nonempty('O apelido da loja é obrigatório').refine((inputValue) => inputValue.trim().length > 0, { message: "O apelido não pode conter apenas espaços" }).max(80, 'O apelido da loja não pode ter mais que 80 caracteres'),
    cnpj: z.string().nonempty('O CNPJ da loja é obrigatório').refine((inputValue) => inputValue.trim().length > 0, { message: "O CNPJ não pode conter apenas espaços" }).max(18, 'O CNPJ não pode ter mais que 18 caracteres'),
    redeId: z.coerce.number().refine(inputValue => inputValue > 0, { message: 'A Regional vinculada é obrigatória' }),
    endereco: z.string().nonempty('O Endereço da loja é obrigatório').refine((inputValue) => inputValue.trim().length > 0, { message: "O Endereço não pode conter apenas espaços" }).max(120, 'O endereço da loja não pode ter mais que 120 caracteres'),
    bairro: z.string().nonempty('Bairro da loja é obrigatório'),
    ativo: z.boolean().default(true)
});

export type StoreFormData = z.infer<typeof StoreFormSchema>;