import { ImageDTO } from "./CommercialImageDTO.dto";

export interface CommercialDTO {
    id?: number;
    tipoAcaoId: number;
    data: Date;
    redeId?: number;
    redeNome?: string;
    lojaId?: number;
    lojaApelido?: string;
    local?: string;
    categoriaProdutoId: number;
    categoriaProdutoNome?: string;
    produtoId?: number;
    produtoNome?: string;
    imagens: (string | File | ImageDTO)[];
};