import { css, styled } from 'styled-components';

import { DrawerOverlayProps } from '../interfaces/drawerOverlayProps.interface';
import { AnimateButtonHover, AnimateDrawerClosing, AnimateDrawerOpening } from '../../../styles/animation.style';

export const DrawerOverlay = styled.div<DrawerOverlayProps>`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(3.5px);
    z-index: 999;
    transition: opacity 0.6s ease-in-out, visibility 0.6s ease-in-out;

    opacity: ${ ({ $open }) => ($open ? 1 : 0) };
    visibility: ${ ({ $open }) => ($open ? "visible" : "hidden") };
`;

export const Drawer = styled.div<{ $open: boolean; }>`
    width: 500px;
    max-width: calc(100% - 60px);
    position: fixed;
    top: 30px;
    right: 30px;
    bottom: 30px;
    display: flex;
    flex-direction: column;
    background-color: #F0F0F5;
    overflow: hidden;
    border-radius: 26px;
    z-index: 1000;

    animation: ${ ({ $open }) => $open ? css`${ AnimateDrawerOpening } 0.6s ease-in-out forwards` : css`${ AnimateDrawerClosing } 0.6s ease-in-out forwards` };
`;

export const Header = styled.div`
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #E9EAEB;
`;

export const Title = styled.h2`
    font-family: "Inter";
    font-weight: 700;
    font-size: 18px;
    color: #171719;
`;

export const CloseButton = styled.button`
    height: 55px;
    width: 55px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: none;
    color: #224463;
    background: none;
    border-radius: 14px;
    cursor: pointer;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #FFFFFF;
            background-color: #223463;

            animation: ${ AnimateButtonHover } 0.6s ease-in-out;
        }
`;

export const Content = styled.div`
    padding: 30px 30px;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 30px;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;

        &::-webkit-scrollbar {
            width: 10px;
        }
        &::-webkit-scrollbar-track {
            margin: 14px 0px;
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background: #C5C5C5;
            border-radius: 10px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #AAAAAA;
        }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 30px;
    overflow-y: visible;
`;

export const Fieldset = styled.fieldset`
    padding: 30px 30px 0px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 30px;
    border: 2px solid #E9EAEB;
    border-radius: 14px;
`;

export const Legend = styled.legend`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0px;
    flex-shrink: 0;
`;

export const VariableTipButton = styled.button<{ $disabled: boolean }>`
    padding: 15px;
    margin-left: auto;
    height: 55px;
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Inter";
    font-weight: 700;
    font-size: 16px;
    border: none;
    color: #FF6B00;
    background: rgba(255, 107, 0, 0.25);
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

    opacity: ${ ({ $disabled }) => $disabled ? "0.5" : "1" };
    cursor: ${ ({ $disabled }) => $disabled ? "not-allowed" : "pointer" };

        &:hover:not(:disabled) {
            color: #F0F0F5;
            background-color: #FF6B00;

            animation: ${ AnimateButtonHover } 0.6s ease-in-out;
        }
`;

export const VariableTipButtonText = styled.span`
    margin-left: 7.5px;
`;

export const FieldWrapper = styled.div`
    width: 100%;
    position: relative;
    box-sizing: border-box;

        &::before {
            content: "";
            position: absolute;
            inset: -6px;
            border-radius: 18px;
            border: 2px solid #1C70E9;
            opacity: 0;
            transform: scale(1.08);
            transition: transform 0.3s ease, opacity 0.3s ease;
            pointer-events: none;
        }

            &:focus-within::before {
                opacity: 1;
                transform: scale(1);
            }
`;

export const TextareaWrapper = styled.div`
    width: 100%;
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    background-color: #FFFFFF;
`;

export const Textarea = styled.textarea`
    padding: 15px;
    min-height: 190px;
    width: 100%;
    display: block;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
    color: #212121;
    border: none;
    outline: none;
    background-color: #FFFFFF;
    border-radius: 14px;
    resize: vertical;

        &::placeholder {
            color: #BDBDBD;
        }

            &::-webkit-scrollbar {
                width: 10px;
            }
            &::-webkit-scrollbar-track {
                margin: 14px 0px;
                background: transparent;
            }
            &::-webkit-scrollbar-thumb {
                background: #C5C5C5;
                border-radius: 10px;
            }
            &::-webkit-scrollbar-thumb:hover {
                background: #AAAAAA;
            }
`;

export const ColorInput = styled.input`
    padding: 15px;
    padding-top: 25px;
    height: 60px;
    width: 100%;
    border: none;
    outline: none;
    background-color: #FFFFFF;
    border-radius: 14px;
    cursor: pointer;

        &::-webkit-color-swatch-wrapper {
            padding: 0;
        }
        &::-webkit-color-swatch {
            border: none;
            border-radius: 14px;
        }
        &::-moz-color-swatch {
            border: none;
            border-radius: 14px;
        }
`;

export const Footer = styled.div`
    margin-top: auto;
    padding: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    column-gap: 30px;
    border-top: 2px solid #E9EAEB;

        &:has(.secondary:hover) {
            .primary {
                font-weight: 700;
                color: #238636;
                background-color: #E6F4EA;
            }
        }
        &:not(:has(.secondary:hover)) {
            .primary {
                animation: ${ AnimateButtonHover } 0.6s ease-in-out;
            }
        }
`;

export const FooterButton = styled.button<{ $variant?: "primary" | "secondary"; $formType?: "default" | "action"; }>`
    padding: 15px;
    height: 55px;
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Inter";
    font-weight: 700;
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

    color: ${ ({ $variant }) => $variant === "primary" ? "#FFFFFF" : "#223463" };
    background-color: ${ ({ $variant }) => $variant === "primary" ? "#238636" : "#E8EEF8" };

        &.secondary {
            svg {
                stroke: #1C70E9;
            }
        }

            &.secondary:hover {
                color: #F0F0F5;
                background-color: #223463;

                animation: ${ AnimateButtonHover } 0.6s ease-in-out;
            }
`;

export const FooterButtonText = styled.span`
    margin-left: 7.5px;
`;

export const ContactImportResultContainer = styled.div``;

export const ImportResultTitle = styled.p`
    margin-bottom: 30px;
    padding: 15px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 7.5px;
    font-weight: bold;
    font-size: 18px;
    color: #1C70E9;
    background-color: #FFFFFF;
    border-radius: 14px;
`;

export const ImportResultInformations = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 30px;
`;

export const ImportResultSucceededTitle = styled.p`
    padding: 7.5px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 7.5px;
    font-weight: bold;
    font-size: 18px;
    color: #81C995;
`;

export const ImportResultUnsucceededTitle = styled(ImportResultSucceededTitle)`
    color: #DC143C;
`;

export const ImportResultErrorListTitle = styled.span`
    margin-bottom: 15px;
    padding-bottom: 15px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 7.5px;
    font-weight: bold;
    font-size: 18px;
    color: #171719;
    background-color: #D9DEE7;
    border-bottom: 2px solid #E9EAEB;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
`;

export const ImportResultErrorList = styled.ul`
    margin: 30px 0px 30px 0px;
    padding: 15px;
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 15px;
    background-color: #D9DEE7;
    border-radius: 14px;
`;
export const ImportResultErrorListItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 7.5px;
`;

export const ImportResultLeftContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const ImportResultRightContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;

export const ImportResultErrorName = styled.p`
    font-family: "Inter";
    font-style: italic;
    font-weight: 500;
    font-size: 14px;
    color: #171719;
`;

export const ImportResultErrorMessage = styled.span`
    font-family: "Inter";
    font-style: italic;
    font-weight: 400;
    font-size: 12px;
    color: #223463;
`;

export const WhatsAppPreviewToggleButton = styled.button<{ $showPreview: boolean }>`
    padding: 15px;
    height: 55px;
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Inter";
    font-weight: 700;
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

    color: ${ ({ $showPreview }) => $showPreview ? "#F0F0F5" : "#075E54" };
    background-color: ${ ({ $showPreview }) => $showPreview ? "#075E54" : "rgba(7, 94, 84, 0.25);" };

        &:hover {
            font-weight: 700;
            color: #F0F0F5;
            background-color: #075E54;

            animation: ${ AnimateButtonHover } 0.6s ease-in-out;
        }
`;

export const WhatsAppPreviewToggleButtonText = styled.span`
    margin-left: 7.5px;
`;
