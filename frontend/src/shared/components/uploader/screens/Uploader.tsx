import { toast } from 'react-toastify';
import React, { useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { Upload, FileCheck, Download, Trash2 } from 'lucide-react';

import * as Styled from '../styles/uploader.style';
import { UploaderItemType } from '../types/uploaderItemType.type';
import { UploaderProps } from '../interfaces/uploaderProps.interface';
import { ACCEPTED_IMAGES_CONFIG, ACCEPTED_EXCEL_CONFIG, ALLOWED_IMAGE_EXTENSIONS } from '../constants/uploaderFileTypesAndExtensions.constant';

const MAX_EXCEL_FILE_SIZE = 50 * 1024 * 1024; // TODO - ENV

const Uploader: React.FC<UploaderProps> = ({ value, onChange, isExcel = false }) => {
    const accept = isExcel ? ACCEPTED_EXCEL_CONFIG : ACCEPTED_IMAGES_CONFIG;

    const getAcceptedText = useCallback(() => {
        if(isExcel) {
            return "XLS ou XLSX de até 50MB";
        }

        return ALLOWED_IMAGE_EXTENSIONS.map((fileExtension: string) => fileExtension.replace(".", "").toUpperCase()).join(", ");
    }, [ isExcel ]);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length !== 1) {
            return;
        }

        onChange(acceptedFiles[0]);
    }, [ onChange ]);
    const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
        const errors = fileRejections[0]?.errors ?? [];

        if (errors.some(error => error.code === "file-too-large")) {
            toast.error("O arquivo deve ter no máximo 50MB");

            return;
        }

        toast.error(`Formato de arquivo inválido. Formatos aceitos: ${ getAcceptedText() }`);
    }, [ getAcceptedText ]);
    const onFileRemove = useCallback(() => {
        onChange(undefined);
    }, [ onChange ]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        multiple: false,
        disabled: !!value,
        accept,
        maxSize: isExcel ? MAX_EXCEL_FILE_SIZE : undefined,
    });

    const getFileName = (item: UploaderItemType): string => {
        return item.name;
    }
    const getFileSize = (item: UploaderItemType): string => {
        return (item.size / 1024).toFixed(1);
    }

    const downloadFile = (item: UploaderItemType) => {
        let url: string;
        let shouldRevokeBlobURL = false;

        if ("url" in item) {
            url = item.url;
        } else {
            url = URL.createObjectURL(item);
            shouldRevokeBlobURL = true;
        }

        const link = document.createElement("a");

        link.href = url;
        link.download = item.name;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        if (shouldRevokeBlobURL) {
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    }

    return (
        <Styled.UploaderWrapper>
            <Styled.DropzoneArea { ...getRootProps() } $isDragActive={ isDragActive }>
                <input { ...getInputProps() } />

                <Styled.DropzoneTextContainer>
                    <Styled.DropzoneUploadIcon> <Upload size={ 25 } /> </Styled.DropzoneUploadIcon>

                    <Styled.DropzoneStrongContent> { isDragActive ? `Solte ${ isExcel ? "o arquivo Excel" : "a imagem" } aqui` : `Arraste e solte ${ isExcel ? "o arquivo Excel" : "a imagem" }` } </Styled.DropzoneStrongContent>

                    <Styled.DropzoneLabel> ou selecione o arquivo </Styled.DropzoneLabel>

                    <Styled.DropzoneActiveText> { isDragActive ? `Selecione apenas ${ isExcel ? "um arquivo Excel" : "uma imagem" }` : `Tipo de arquivo ${ getAcceptedText() }` } </Styled.DropzoneActiveText>
                </Styled.DropzoneTextContainer>
            </Styled.DropzoneArea>

            <Styled.FileCountText> { value ? 1 : 0 } de 1 arquivo </Styled.FileCountText>

                { value && (
                    <Styled.DraggedFilesList>
                        <Styled.DraggedFilesListItem>
                            <Styled.ListItemContainer>
                                <Styled.DraggedFileIcon> <FileCheck size={ 25 } /> </Styled.DraggedFileIcon>

                                <Styled.DraggedFileData>
                                    <Styled.DraggedFileName> { getFileName(value) } </Styled.DraggedFileName>
                                    <Styled.DraggedFileSize> { getFileSize(value) } KB </Styled.DraggedFileSize>
                                </Styled.DraggedFileData>
                            </Styled.ListItemContainer>

                            <Styled.DraggedFilesActionsContainer>
                                <Styled.DraggedFilesActionButton type="button" onClick={ () => downloadFile(value) }> <Download size={ 25 } /> </Styled.DraggedFilesActionButton>
                                <Styled.DraggedFilesActionButton type="button" onClick={ onFileRemove }> <Trash2 size={ 25 } /> </Styled.DraggedFilesActionButton>
                            </Styled.DraggedFilesActionsContainer>
                        </Styled.DraggedFilesListItem>
                    </Styled.DraggedFilesList>
                ) }
        </Styled.UploaderWrapper>
    );
}

export default Uploader;
