import { toast } from 'react-toastify';
import { FileRejection, useDropzone } from 'react-dropzone';
import React, { useCallback, useEffect, useMemo } from 'react';

import * as S from '../styles/uploader.style';
import * as I from '../../../../shared/styles/icon.style';

import { UploaderItemType } from '../types/uploaderItemType.type';
import { UploaderProps } from '../interfaces/UploaderProps.interface';
import { ACCEPTED_CSV_CONFIG, ACCEPTED_IMAGES_CONFIG, ALLOWED_IMAGE_EXTENSIONS } from '../constants/uploaderFileTypesAndExtensions.constant';

const REACT_APP_MAX_IMAGE_SIZE = Number(process.env.REACT_APP_MAX_IMAGE_SIZE);
const REACT_APP_MAX_CSV_SIZE = Number(process.env.REACT_APP_MAX_CSV_SIZE);

export const Uploader: React.FC<UploaderProps> = ({ value, existingImage, blockRemove = false, onRemoveExistingImage, onChange, isCsv = false }) => {
    const hasFile = !!value || !!existingImage;
    const shouldShowDropzone = !isCsv || !hasFile;
    const accept = isCsv ? ACCEPTED_CSV_CONFIG : ACCEPTED_IMAGES_CONFIG;
    const maxFileSize = isCsv ? REACT_APP_MAX_CSV_SIZE : REACT_APP_MAX_IMAGE_SIZE;

    const getMaxFileSizeText = useCallback(() => {
        const maxFileSizeInMB = maxFileSize / (1024 * 1024);

        return `${ maxFileSizeInMB } MB`;
    }, [ maxFileSize ]);
    const getAcceptedText = useCallback(() => {
        if (isCsv) {
            return `CSV de até ${ getMaxFileSizeText() }`;
        }

        return `${ ALLOWED_IMAGE_EXTENSIONS.map((fileExtension: string) => fileExtension.replace(".", "").toUpperCase()).join(", ") } de até ${ getMaxFileSizeText() }`;
    }, [ isCsv, getMaxFileSizeText ]);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length !== 1) {
            return;
        }

        onChange(acceptedFiles[0]);
    }, [ onChange ]);
    const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
        const errors = fileRejections[0]?.errors ?? [];

        if (errors.some(error => error.code === "file-too-large")) {
            toast.error(`O arquivo deve ter no máximo ${ getMaxFileSizeText() }`);

            return;
        }

        toast.error(`Formato de arquivo inválido. Formatos aceitos: ${ getAcceptedText() }`);
    }, [ getAcceptedText, getMaxFileSizeText ]);
    const onFileRemove = useCallback(() => {
        if (value) {
            onChange(undefined);

            return;
        }
        if (existingImage) {
            onRemoveExistingImage?.();
        }
    }, [ value, existingImage, onChange, onRemoveExistingImage, ]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,

        multiple: false,
        disabled: !!value || !!existingImage,
        accept,
        maxSize: maxFileSize,
    });
    const getExistingFileName = (url: string): string => {
        try {
            return decodeURIComponent(url.split("/").pop() ?? "Imagem");
        } catch {
            return "Imagem";
        }
    };
    const getFileName = (item?: UploaderItemType): string => {
        if (item) {
            return item.name;
        }
        if (existingImage) {
            return getExistingFileName(existingImage);
        }

        return isCsv ? "Arquivo CSV" : "Imagem";
    };
    const getFileSize = (item?: UploaderItemType): string => {
        if (!item) {
            return "";
        }

        const sizeInKB = item.size / 1024;

        if (sizeInKB >= 1024) {
            return `${ (sizeInKB / 1024).toFixed(1) } MB`;
        }

        return `${ sizeInKB.toFixed(1) } KB`;
    };
    const downloadFile = () => {
        if (value) {
            let url: string;
            let shouldRevokeBlobURL = false;

            if ("url" in value) {
                url = value.url;
            } else {
                url = URL.createObjectURL(value);
                shouldRevokeBlobURL = true;
            }

            const link = document.createElement("a");

            link.href = url;
            link.download = value.name;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            if (shouldRevokeBlobURL) {
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }

            return;
        }
        if (existingImage) {
            const link = document.createElement("a");

            link.href = existingImage;
            link.download = getExistingFileName(existingImage);
            link.target = "_blank";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        }
    };
    const filePreview = useMemo(() => {
        if (isCsv) {
            return undefined;
        }
        if (value instanceof File) {
            return URL.createObjectURL(value);
        }

        return existingImage;
    }, [ value, existingImage, isCsv ]);

    useEffect(() => {
        if (isCsv || !(value instanceof File) || !filePreview) {
            return;
        }

        return () => {
            URL.revokeObjectURL(filePreview);
        };
    }, [ value, filePreview, isCsv, ]);

    return (
        <S.UploaderWrapper>
            { shouldShowDropzone && (!blockRemove || hasFile) && (
                <S.DropzoneArea { ...getRootProps() } $isDragActive={ isDragActive } $hasFile={ !!value || !!existingImage } $backgroundImage={ filePreview }>
                    <input { ...getInputProps() }/>

                    { !hasFile && (
                        <S.DropzoneTextContainer>
                            <S.DropzoneUploadArea> <I.UploadIcon/> </S.DropzoneUploadArea>

                            <S.DropzoneStrongContent> { isDragActive ? `Solte ${ isCsv ? "o arquivo CSV" : "a imagem" } aqui` : `Arraste e solte ${ isCsv ? "o arquivo CSV" : "a imagem" }` } </S.DropzoneStrongContent>

                            <S.DropzoneLabel> ou selecione o arquivo </S.DropzoneLabel>

                            <S.DropzoneActiveText> { isDragActive ? `Somente ${ isCsv ? "um arquivo CSV é permitido" : "uma imagem é permitida" }` : `Tipos aceitos: ${ getAcceptedText() }` } </S.DropzoneActiveText>
                        </S.DropzoneTextContainer>
                    ) }
                </S.DropzoneArea>
            ) }
            { hasFile && (
                <S.DraggedFilesList>
                    <S.DraggedFilesListItem>
                        <S.ListItemContainer>
                            <S.DraggedFileArea> { isCsv ? <I.FileUpIcon/> : <I.ImageUpIcon/> } </S.DraggedFileArea>

                            <S.DraggedFileData>
                                <S.DraggedFileName> { getFileName(value) } </S.DraggedFileName>

                                { value && ( <S.DraggedFileSize> { getFileSize(value) } </S.DraggedFileSize> ) }
                            </S.DraggedFileData>
                        </S.ListItemContainer>

                        <S.DraggedFilesActionsContainer>
                            <S.DraggedFilesActionButton type="button" onClick={ downloadFile }> { isCsv ? <I.FileDownIcon/> : <I.ImageDownIcon/> } </S.DraggedFilesActionButton>

                            { !blockRemove && (<S.DraggedFilesActionButton type="button" onClick={ onFileRemove }> <I.EraserIcon/> </S.DraggedFilesActionButton>) }
                        </S.DraggedFilesActionsContainer>
                    </S.DraggedFilesListItem>
                </S.DraggedFilesList>
            ) }
        </S.UploaderWrapper>
    );
}
