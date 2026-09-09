import { toast } from 'react-toastify';
import { Accept } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import React, { useCallback, useEffect } from 'react';
import { Upload, FileCheck, Download, Trash2 } from 'lucide-react';

import * as Styled from '../styles/Uploader.style';
import { UploaderItemType } from '../types/UploaderItemType.type';
import { UploaderProps } from '../interfaces/UploaderProps.interface';

const Uploader: React.FC<UploaderProps> = ({ value, onChange, isExcel = false }) => {
    const MAX_IMAGES = 3;
    const MAX_FILES = isExcel ? 1 : MAX_IMAGES;

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const totalFiles = value.length + acceptedFiles.length;

        if (totalFiles > MAX_FILES) {
            toast.error(`Somente é possível enviar até ${MAX_FILES} ${isExcel ? 'arquivo Excel' : 'imagens'}`);

            return;
        };

        onChange([...value, ...acceptedFiles]);
    }, [value, onChange, MAX_FILES, isExcel]);
    const onRemove = useCallback((index: number) => {
        const updated = [...value];

        updated.splice(index, 1);

        onChange(updated);
    }, [value, onChange]);
    const acceptImages: Accept = { 'image/jpeg': [], 'image/png': [], 'image/jpg': [] };
    const acceptExcel: Accept = { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [] };
    const accept = isExcel ? acceptExcel : acceptImages;
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: !isExcel, accept });
    const getAcceptText = () => {
        if (isExcel) {
            return 'XLSX até 50 MB';
        } else {
            const allowedExtensions = Object.keys(accept)
                .map(mime => {
                    if (mime.includes('jpeg')) {
                        return 'JPEG';
                    };
                    if (mime.includes('png')) {
                        return 'PNG';
                    };
                    if (mime.includes('jpg')) {
                        return 'JPG';
                    };

                    return mime;
                }).join(', ');

            return allowedExtensions;
        };
    };
    const getFileName = (item: UploaderItemType): string => {
        if ('nome' in item) {
            return item.nome;
        };

        return item.name;
    };
    const getFileSize = (item: UploaderItemType): string => {
        const sizeInBytes = 'tamanho' in item ? item.tamanho : item.size;

        return (sizeInBytes / 1024).toFixed(1);
    };
    const getPreviewUrl = (item: UploaderItemType): string => {
        if ('url' in item) {
            return item.url;
        };

        return URL.createObjectURL(item);
    };
    const downloadFile = (item: UploaderItemType) => {
        if ('url' in item) {
            const link = document.createElement('a');

            link.href = item.url;
            link.download = item.nome;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        } else {
            const url = URL.createObjectURL(item);
            const link = document.createElement('a');

            link.href = url;
            link.download = item.name;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        };
    };

    useEffect(() => {
        return () => {
            value.forEach(item => {
                if (!('url' in item)) {
                    URL.revokeObjectURL(getPreviewUrl(item));
                }
            });
        };
    }, [value]);

    return (
        <Styled.UploaderWrapper>
            <Styled.DropzoneArea {...getRootProps()} $isDragActive={isDragActive}>
                <input {...getInputProps()} />

                {isDragActive ? (
                    <Styled.DropzoneTextContainer>
                        <Styled.DropzoneUploadIcon> <Upload size={24} /> </Styled.DropzoneUploadIcon>

                        <Styled.DropzoneStrongContent> Arraste e solte o {isExcel ? 'arquivo Excel' : 'os arquivos de imagem'} aqui </Styled.DropzoneStrongContent>

                        <Styled.DropzoneLabel> ou selecione os arquivos </Styled.DropzoneLabel>
                        <Styled.DropzoneInactiveText> {isExcel ? 'Selecione apenas 1 arquivo .xlsx' : 'Selecione até 3 fotos'} </Styled.DropzoneInactiveText>
                    </Styled.DropzoneTextContainer>
                ) : (
                    <Styled.DropzoneTextContainer>
                        <Styled.DropzoneUploadIcon> <Upload size={24} /> </Styled.DropzoneUploadIcon>

                        <Styled.DropzoneStrongContent> Arraste e solte {isExcel ? 'o arquivo Excel' : 'os arquivos de imagem'} </Styled.DropzoneStrongContent>

                        <Styled.DropzoneLabel> {isExcel ? 'ou selecione o arquivo' : 'ou selecione os arquivos'} </Styled.DropzoneLabel>
                        <Styled.DropzoneActiveText> Tipo de arquivo {getAcceptText()} </Styled.DropzoneActiveText>
                    </Styled.DropzoneTextContainer>
                )}
            </Styled.DropzoneArea>

            <Styled.FileCountText> {value.length} de {MAX_FILES} {isExcel ? 'arquivo' : 'arquivos'} </Styled.FileCountText>

            {value.length > 0 && (
                <Styled.DraggedFilesList>
                    {value.map((item, index) => (
                        <Styled.DraggedFilesListItem key={index}>
                            <Styled.ListItemContainer>
                                <Styled.DraggedFileIcon> <FileCheck size={24} /> </Styled.DraggedFileIcon>
                                <Styled.DraggedFileData>
                                    <Styled.DraggedFileName> {getFileName(item)} </Styled.DraggedFileName>
                                    <Styled.DraggedFileSize> {getFileSize(item)} KB </Styled.DraggedFileSize>
                                </Styled.DraggedFileData>
                            </Styled.ListItemContainer>

                            <Styled.DraggedFilesActionsContainer>
                                <Styled.DraggedFilesActionButton type="button" onClick={() => downloadFile(item)}> <Download size={24} /> </Styled.DraggedFilesActionButton>
                                <Styled.DraggedFilesActionButton type="button" onClick={() => onRemove(index)}> <Trash2 size={24} /> </Styled.DraggedFilesActionButton>
                            </Styled.DraggedFilesActionsContainer>
                        </Styled.DraggedFilesListItem>
                    ))}
                </Styled.DraggedFilesList>
            )}
        </Styled.UploaderWrapper>
    );
};

export default Uploader;