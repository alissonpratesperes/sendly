import { z } from 'zod';
import { FileWithPath } from "react-dropzone";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const isFileWithPath = (file: unknown): file is FileWithPath => {
    return file instanceof File && 'path' in file;
};
const UploadedFileSchema = z.custom<FileWithPath>(isFileWithPath, { message: 'Arquivo inválido' })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size > 0 && file.size <= MAX_FILE_SIZE, { message: 'Arquivo inválido, tamanho ou tipo incorreto' })
    .refine((image) => image.size > 0, { message: 'Uma ou mais imagens estão vazias' })
    .refine((image) => ACCEPTED_IMAGE_TYPES.includes(image.type), { message: 'Somente serão aceitos arquivos de imagem' })
    .refine((image) => image.size <= MAX_FILE_SIZE, { message: 'O tamanho máximo permitido é de 5MB por imagem' });
const UploadedUrlSchema = z.object({
    url: z.string().refine(inputValue => inputValue.startsWith('http') || inputValue.startsWith('data:image/'), { message: 'URL inválida ou BASE64 inválido' }),
    nome: z.string(),
    tamanho: z.number(),
    contentType: z.string().optional()
});
const UploaderItemTypeSchema = z.union([UploadedFileSchema, UploadedUrlSchema]);

export const CommercialFormSchema = z.object({
    id: z.number().optional(),
    tipoAcaoId: z.coerce.number().refine(inputValue => inputValue > 0, { message: 'Tipo de Ação é obrigatória' }),
    data: z.coerce.date().refine(date => !isNaN(date.getTime()), { message: 'A data da ação é obrigatória' }),
    redeId: z.coerce.number().optional().refine((inputValue) => inputValue === undefined || inputValue > 0, { message: 'Rede inválida' }),
    lojaId: z.coerce.number().optional().refine((inputValue) => inputValue === undefined || inputValue > 0, { message: 'Loja inválida' }),
    local: z.string().optional(),
    categoriaProdutoId: z.coerce.number().refine(inputValue => inputValue > 0, { message: 'A categoria do produto é obrigatória' }),
    produtoId: z.coerce.number().optional(),
    imagens: z.array(UploaderItemTypeSchema).nonempty({ message: 'Pelo menos uma imagem deve ser enviada' })
}).refine((formData) => {
    const hasChain = !!formData.redeId && formData.redeId > 0;
    const hasStore = !!formData.lojaId && formData.lojaId > 0;
    const hasLocal = !!formData.local && formData.local.trim().length > 0;

    return hasChain || hasStore || hasLocal;
}, {
    message: 'Selecione pelo pelos um dos campos: Rede, Loja ou Local público'
});

export type CommercialFormData = z.infer<typeof CommercialFormSchema>;