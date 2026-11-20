import styled, { css } from 'styled-components';

import { AnimateButtonHover, AnimateModalClosing, AnimateModalOpening } from './animation.style';

export const ModalOverlay = styled.div<{ $open: boolean }>`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(3.5px);
    z-index: 1000;
    transition: opacity 0.6s ease-in-out, visibility 0.6s ease-in-out;

    opacity: ${ ({ $open }) => ($open ? 1 : 0) };
    visibility: ${ ({ $open }) => ($open ? "visible" : "hidden") };
`;

export const ModalWrapper = styled.div<{ $open: boolean }>`
    min-height: 208px;
    min-width: 500px;
    width: auto;
    background-color: #F0F0F5;
    border-radius: 26px;
    box-sizing: border-box;

    animation: ${ ({ $open }) => $open ? css`${ AnimateModalOpening } 0.6s ease-in-out forwards` : css`${ AnimateModalClosing } 0.6s ease-in-out forwards` };
`;

export const ModalContainer = styled.div`
    position: relative;
`;

export const ModalHeader = styled.div`
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #E9EAEB;
`;

export const ModalTitle = styled.h3`
    font-family: "Orbitron";
    font-weight: 700;
    font-size: 18px;
    color: #171719;
`;

export const ModalDismissButton = styled.button`
    height: 55px;
    width: 55px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: none;
    color: #224463;
    background-color: #E8EEF8;
    border-radius: 14px;
    cursor: pointer;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #FFFFFF;
            background-color: #223463;

            animation: ${ AnimateButtonHover } 0.6s ease-in-out;
        }
`;

export const ModalBody = styled.div`
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const ModalInnerBodyContainer = styled.div`
    width: 100%;
`;

export const ModalText = styled.p`
    font-family: "Inter";
    font-weight: 500;
    font-size: 16px;
    color: #2F2E33;
`;

export const ModalBoldText = styled.b`
    font-weight: 700;
`;

export const ModalFooter = styled.div`
    margin-top: auto;
    padding: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    column-gap: 30px;
    border-top: 2px solid #E9EAEB;
`;

export const ModalFooterButtonText = styled.span`
    margin-left: 7.5px;
`;

export const ModalButton = styled.button`
    padding: 15px;
    height: 55px;
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Orbitron";
    font-weight: 700;
    font-size: 16px;
    border: none;
    cursor: pointer;
`;

export const ModalPrimaryButton = styled(ModalButton)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #223463;
    background-color: #E8EEF8;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        svg {
            stroke: #1C70E9;
        }

            &:hover {
                color: #FFFFFF;
                background-color: #223463;

                animation: ${ AnimateButtonHover } 0.6s ease-in-out;
            }
`;

export const ModalSecondaryButton = styled(ModalButton)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #DC143C;
    background-color: #FCE8E6;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #FFFFFF;
            background-color: #DC143C;

            animation: ${ AnimateButtonHover } 0.6s ease-in-out;
        }
`;

export const ModalTertiaryButton = styled(ModalButton)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #FF6B00;
    background: rgba(255, 107, 0, 0.25);
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #F0F0F5;
            background-color: #FF6B00;

            animation: ${ AnimateButtonHover } 0.6s ease-in-out;
        }
`;
