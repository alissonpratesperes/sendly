import styled from 'styled-components';

import { DropzoneProps } from '../interfaces/dropzoneProps.interface';

export const UploaderWrapper = styled.div`
    width: 100%;
`;

export const DropzoneArea = styled.div<DropzoneProps>`
    width: 100%;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 14px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    ${ ({ $isDragActive }) => $isDragActive && `border: 2px dashed #1C70E9;` };
    border: ${ ({ $backgroundImage }) => $backgroundImage ? "none" : "2px dashed #D3D2D9" };
    background-image: ${ ({ $backgroundImage }) => $backgroundImage ? `url("${ $backgroundImage }")` : "none" };
    ${ ({ $isDragActive, $backgroundImage }) => $isDragActive && !$backgroundImage && `border: 2px dashed #1C70E9;` }
`;

export const DropzoneTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const DropzoneUploadIcon = styled.div`
    height: 55px;
    width: 55px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #D3D2D9;
    border-radius: 50%;

        svg {
            color: #1C70E9;
        }
`;

export const DropzoneStrongContent = styled.h5`
    margin-top: 15px;
    font-family: "Lato";
    font-weight: 700;
    font-size: 14px;
    color: #171719;
`;

export const DropzoneLabel = styled.h5`
    font-family: "Lato";
    font-weight: 500;
    font-size: 14px;
    color: #1C70E9;
`;

export const DropzoneActiveText = styled.p`
    margin-top: 15px;
    font-family: "Lato";
    font-weight: 400;
    font-size: 14px;
    color: #767380;
`;

export const DraggedFilesList = styled.ul`
    padding: 0;
    list-style: none;
`;

export const DraggedFilesListItem = styled.li`
    margin: 30px 0px 30px 0px;
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const ListItemContainer = styled.div`
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    column-gap: 15px;
`;

export const DraggedFileIcon = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: #1C70E9;
`;

export const DraggedFileData = styled.div`
    margin-right: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
`;

export const DraggedFileName = styled.p`
    font-family: "Lato";
    font-weight: 500;
    font-size: 14px;
    color: #171719;
`;

export const DraggedFileSize = styled.span`
    margin-top: 7.5px;
    font-family: "Lato";
    font-weight: 900;
    font-size: 14px;
    color: #1C70E9;
`;

export const DraggedFilesActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 7.5px;
`;

export const DraggedFilesActionButton = styled.button`
    padding: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
    cursor: pointer;
    color: #1C70E9;
    background-color: #D3D2D9;
    border-radius: 50%;
    cursor: pointer;
    transition: color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #FFFFFF;
            background: #1C70E9;
            animation: UploaderFileActionsButtonsEffect 0.6s ease-in-out;
        }

            svg {
                stroke: currentColor;
            }

                @keyframes UploaderFileActionsButtonsEffect {
                    0% {
                        transform: scale(1.08);
                    }

                    50% {
                        transform: scale(0.95);
                    }

                    100% {
                        transform: scale(1);
                    }
                }
`;
