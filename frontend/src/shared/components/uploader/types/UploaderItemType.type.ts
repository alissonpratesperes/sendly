import { FileWithPath } from "react-dropzone/.";

export type UploaderItemType = | FileWithPath | { url: string; nome: string; imagemBase64?: string; tamanho: number; contentType?: string; file?: File; };