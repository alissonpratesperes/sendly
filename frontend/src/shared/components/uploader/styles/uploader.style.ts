import styled from 'styled-components';

import { DropzoneProps } from '../interfaces/dropzoneProps.interface';

export const UploaderWrapper = styled.div`
    width: 100%;
`;

export const DropzoneArea = styled.div<DropzoneProps>`
    margin-bottom: 30px;
    height: 220px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 14px;
    border: none;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-color 0.3s ease-in-out;

    ${({ $backgroundImage }) => !$backgroundImage && `&:hover { background-color: #E8EEF8; } `};
    background-image: ${({ $backgroundImage }) => $backgroundImage ? `url("${$backgroundImage}")` : "none" };
    background-color: ${({ $isDragActive, $backgroundImage }) => $isDragActive && !$backgroundImage ? "#E8EEF8" : "#FFFFFF" };

        &::before {
            content: "";
            position: absolute;
            inset: -6px;
            border-radius: 18px;
            border: 2px solid #1C70E9;
            opacity: 0;
            pointer-events: none;
            transform: scale(1.08);
            transition: transform 0.3s ease, opacity 0.3s ease;
        }

    ${({ $isDragActive, $backgroundImage }) => !$backgroundImage && `&:hover::before { opacity: 1; transform: scale(1); }; ${ $isDragActive ? `&::before { opacity: 1; transform: scale(1); }` : "" }` };
`;

export const DropzoneTextContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const DropzoneUploadIcon = styled.div`
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

        svg {
            color: #223463;
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
    color: #223463;
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
    margin-bottom: 30px;
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const ListItemContainer = styled.div`
    height: auto;
    min-width: 0;
    flex: 1;
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
    color: #223463;
`;

export const DraggedFileData = styled.div`
    margin-right: 15px;
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
`;

export const DraggedFileName = styled.p`
    width: 100%;
    margin: 0;
    font-family: "Lato";
    font-weight: 500;
    font-size: 14px;
    color: #171719;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
`;

export const DraggedFileSize = styled.span`
    margin-top: 7.5px;
    font-family: "Lato";
    font-weight: 900;
    font-size: 14px;
    color: #223463;
`;

export const DraggedFilesActionsContainer = styled.div`
    height: 55px;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
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
    color: #FF6B00;
    background-color: rgba(255, 107, 0, 0.25);
    border-radius: 50%;
    cursor: pointer;
    transition: color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #FF6B00;
            background: rgba(255, 107, 0, 0.25);
            animation: uploaderButtonsEffect 0.6s ease-in-out;
        }

            &:first-child {
                border-radius: 0px;
                border-top-left-radius: 14px;
                border-bottom-left-radius: 14px;
            }
            &:nth-child(2) {
                border-radius: 0px;
                border-top-right-radius: 14px;
                border-bottom-right-radius: 14px;
            }
            &:only-child {
                border-radius: 14px;
            }

                svg {
                    stroke: currentColor;
                }

                    @keyframes uploaderButtonsEffect {
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
