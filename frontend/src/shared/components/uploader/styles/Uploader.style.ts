import styled from 'styled-components';

import { DropzoneProps } from '../interfaces/DropzoneProps.interface';

export const UploaderWrapper = styled.div``;

export const DropzoneArea = styled.div<DropzoneProps>`
    padding: 40px 40px 40px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 8px;
    border: 2px dashed ${props => (props.$isDragActive ? '#1C70E9' : '#D3D2D9')};
`;

export const DropzoneTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const DropzoneUploadIcon = styled.div`
    height: 40px;
    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #F5F5F7;
    border-radius: 50%;

        svg {
            color: #1C70E9;
        }
`;

export const DropzoneStrongContent = styled.h5`
    line-height: 21px;
    margin-top: 10px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 14px;
    color: #171719;
`;

export const DropzoneLabel = styled.h5` 
    line-height: 18px;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 12px;
    color: #1C70E9;
`;

export const DropzoneActiveText = styled.p`
    margin-top: 8px;
    line-height: 18px;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 12px;
    color: #767380;
`;

export const DropzoneInactiveText = styled.p`
    margin-top: 8px;
    line-height: 18px;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 12px;
    color: #FC9C45;
`;

export const DraggedFilesList = styled.ul`
    padding: 0px 0px 0px 0px;
    list-style: none;
`;

export const ListItemContainer = styled.div`
    height: 59px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    column-gap: 20px;
`;

export const DraggedFilesListItem = styled.li`
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between; 
`;

export const DraggedFileIcon = styled.div`
    height: 40px;
    width: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #F5F5F7;
`;

export const DraggedFileData = styled.div`
    height: 43px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
`;

export const DraggedFileName = styled.p`
    line-height: 21px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 14px;
    color: #2F2E33;
`;

export const DraggedFileSize = styled.span`
    line-height: 18px;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 12px;
    color: #767380;
`;

export const DraggedFilesActionButton = styled.button`
    height: 43px;
    width: 32px;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
`;

export const DraggedFilesActionsContainer = styled.div` 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

        ${DraggedFilesActionButton}:first-child {
            padding-right: 8px;
        }
        ${DraggedFilesActionButton}:last-child {
            padding-left: 8px;
        }
`;

export const FileCountText = styled.p`
    height: 34px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 12px;
    color: #767380;
`;