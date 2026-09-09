import { UploaderItemType } from '../components/uploader/types/UploaderItemType.type';

export const formatImagesWithBase64ToUploaderUtil = (backendImages: any[]): UploaderItemType[] => backendImages.map((backendImage) => {
    const originalName = backendImage.path?.split('/').pop();
    const extensionFromMime = backendImage.contentType?.split('/').pop();
    const defaultExtension = extensionFromMime ? `.${extensionFromMime}` : '.jpg';

    return {
        nome: originalName ?? `imagem${defaultExtension}`,
        url: `data:${backendImage.contentType};base64,${backendImage.imagemBase64}`,
        tamanho: backendImage.tamanho ?? 0,
        contentType: backendImage.contentType
    };
});