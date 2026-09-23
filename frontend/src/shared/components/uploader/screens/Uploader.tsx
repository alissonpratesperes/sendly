import { toast } from 'react-toastify';
import { FileRejection, useDropzone } from 'react-dropzone';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Upload, ImageUp, Download, Trash2 } from 'lucide-react';

import * as Styled from '../styles/uploader.style';
import { UploaderItemType } from '../types/uploaderItemType.type';
import { UploaderProps } from '../interfaces/UploaderProps.interface';
import { ACCEPTED_EXCEL_CONFIG, ACCEPTED_IMAGES_CONFIG, ALLOWED_IMAGE_EXTENSIONS } from '../constants/uploaderFileTypesAndExtensions.constant';

const MAX_EXCEL_FILE_SIZE = Number(process.env.REACT_APP_MAX_EXCEL_SIZE);
const MAX_IMAGE_FILE_SIZE = Number(process.env.REACT_APP_MAX_IMAGE_SIZE);

const Uploader: React.FC<UploaderProps> = ({ value, existingImage, onRemoveExistingImage, onChange, isExcel = false }) => {
    const accept = isExcel ? ACCEPTED_EXCEL_CONFIG : ACCEPTED_IMAGES_CONFIG;
    const maxFileSize = isExcel ? MAX_EXCEL_FILE_SIZE : MAX_IMAGE_FILE_SIZE;

    const getMaxFileSizeText = useCallback(() => {
        const maxFileSizeInMB = maxFileSize / (1024 * 1024);

        return `${ maxFileSizeInMB } MB`;
    }, [ maxFileSize ]);
    const getAcceptedText = useCallback(() => {
        if (isExcel) {
            return `XLS ou XLSX de até ${ getMaxFileSizeText() }`;
        }

        return ALLOWED_IMAGE_EXTENSIONS.map((fileExtension: string) => fileExtension.replace(".", "").toUpperCase()).join(", ");
    }, [ isExcel, getMaxFileSizeText ]);
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
            onRemoveExistingImage();
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

        return "Imagem";
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
    const imagePreview = useMemo(() => {
        if (value instanceof File) {
            return URL.createObjectURL(value);
        }

        return existingImage;
    }, [ value, existingImage ]);

    useEffect(() => {
        if (!(value instanceof File) || !imagePreview) {
            return;
        }

        return () => {
            URL.revokeObjectURL(imagePreview);
        };
    }, [ value, imagePreview ]);

    return (
        <Styled.UploaderWrapper>
            <Styled.DropzoneArea { ...getRootProps() } $isDragActive={ isDragActive } $hasFile={ !!value || !!existingImage } $backgroundImage={ imagePreview }>
                <input { ...getInputProps() } />

                { !value && !existingImage &&  (
                    <Styled.DropzoneTextContainer>
                        <Styled.DropzoneUploadIcon> <Upload size={ 25 } /> </Styled.DropzoneUploadIcon>

                        <Styled.DropzoneStrongContent> { isDragActive ? `Solte ${ isExcel ? "o arquivo Excel" : "a imagem" } aqui` : `Arraste e solte ${ isExcel ? "o arquivo Excel" : "a imagem" }` } </Styled.DropzoneStrongContent>

                        <Styled.DropzoneLabel> ou selecione o arquivo </Styled.DropzoneLabel>

                        <Styled.DropzoneActiveText> { isDragActive ? `Somente ${ isExcel ? "um arquivo Excel é permitido" : "uma imagem é permitida" }` : `Tipo de arquivo ${ getAcceptedText() }` } </Styled.DropzoneActiveText>
                    </Styled.DropzoneTextContainer>
                ) }
            </Styled.DropzoneArea>

            { (value || existingImage) && (
                <Styled.DraggedFilesList>
                    <Styled.DraggedFilesListItem>
                        <Styled.ListItemContainer>
                            <Styled.DraggedFileIcon> <ImageUp size={ 25 } /> </Styled.DraggedFileIcon>

                            <Styled.DraggedFileData>
                                <Styled.DraggedFileName> { getFileName(value) } </Styled.DraggedFileName>

                                { value && ( <Styled.DraggedFileSize> { getFileSize(value) } </Styled.DraggedFileSize> ) }
                            </Styled.DraggedFileData>
                        </Styled.ListItemContainer>

                        <Styled.DraggedFilesActionsContainer>
                            <Styled.DraggedFilesActionButton type="button" onClick={ downloadFile }> <Download size={ 25 } /> </Styled.DraggedFilesActionButton>
                            <Styled.DraggedFilesActionButton type="button" onClick={ onFileRemove }> <Trash2 size={ 25 } /> </Styled.DraggedFilesActionButton>
                        </Styled.DraggedFilesActionsContainer>
                    </Styled.DraggedFilesListItem>
                </Styled.DraggedFilesList>
            ) }
        </Styled.UploaderWrapper>
    );
}

export default Uploader;
