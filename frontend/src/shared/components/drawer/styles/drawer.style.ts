import { styled } from 'styled-components';

import { DrawerOverlayProps } from '../interfaces/drawerOverlayProps.interface';

export const DrawerOverlay = styled.div<DrawerOverlayProps>`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(7px);
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
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 14px;
    z-index: 1000;

    animation: ${ ({ $open }) => $open ? "drawerOpen 0.6s ease-in-out forwards" : "drawerClose 0.6s ease-in-out forwards" };

        &::-webkit-scrollbar {
            width: 8px;
        }
        &::-webkit-scrollbar-track {
            margin-top: 14px;
            margin-bottom: 14px;
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background: #C5C5C5;
            border-radius: 10px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #AAAAAA;
        }

            @keyframes drawerOpen {
                0% {
                    transform: translateX(calc(100% + 30px));
                }

                70% {
                    transform: translateX(-15px);
                }

                100% {
                    transform: translateX(0);
                }
            }
            @keyframes drawerClose {
                0% {
                    transform: translateX(0);
                }

                30% {
                    transform: translateX(-15px);
                }

                100% {
                    transform: translateX(calc(100% + 30px));
                }
            }
`;

export const Header = styled.div`
    padding: 15px;
    margin-bottom: 30px;
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
            animation: closeButtonEffect 0.6s ease-in-out;
        }

            svg {
                stroke: currentColor;
            }

                @keyframes closeButtonEffect {
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

export const Content = styled.div`
    padding: 0px 30px;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 30px;
    overflow-y: visible;
    box-sizing: border-box;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 30px;
    overflow-y: visible;
`;

export const Fieldset = styled.fieldset`
    margin-bottom: 30px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 30px;
    border: 2px solid #E9EAEB;
    border-radius: 14px;
`;

export const Legend = styled.legend`
    padding: 0px 7.5px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between
    font-family: "Inter";
    font-weight: 700;
    font-size: 18px;
    color: #171719;
`;

export const Tip = styled.span`
    margin-left: auto;
    padding: 7.5px;
    font-family: "Lato";
    font-weight: 700;
    font-size: 14px;
    color: #1C70E9;
    background-color: #D3D2D9;
    border-radius: 7px;
    pointer-events: none;
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
            border: 2px solid #223463;
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

export const Label = styled.label`
    position: absolute;
    left: 15px;
    top: 7.5px;
    text-transform: uppercase;
    font-family: "Lato";
    font-weight: 700;
    font-size: 12px;
    color: #223463;
    pointer-events: none;
`;

export const Input = styled.input`
    padding: 15px 15px 0px 15px;
    height: 60px;
    width: 100%;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
    color: #212121;
    border: none;
    outline: none;
    background-color: #FFFFFF;
    border-radius: 14px;
    z-index: 1;

        &::placeholder {
            color: #BDBDBD;
        }
`;

export const Textarea = styled.textarea`
    padding: 15px 15px 0px 15px;
    height: 60px;
    min-height: 120px;
    width: 100%;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
    color: #212121;
    border: none;
    outline: none;
    background-color: #FFFFFF;
    border-radius: 14px;
    resize: vertical;
    z-index: 1;

        &::placeholder {
            color: #BDBDBD;
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
                font-weight: 400;
                color: #238636;
                background-color: transparent;
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
    font-weight: 400;
    font-size: 16px;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

    font-weight: ${ ({ $variant }) => $variant === "primary" ? "700" : "400" };
    color: ${ ({ $variant }) => $variant === "primary" ? "#FFFFFF" : "#223463" };
    background-color: ${ ({ $variant }) => $variant === "primary" ? "#238636" : "transparent" };

        &.secondary:hover {
            font-weight: 700;
            color: #FFFFFF;
            background-color: #223463;
            animation: footerButtonEffect 0.6s ease-in-out;
        }

            svg {
                stroke: currentColor;
            }

                @keyframes footerButtonEffect {
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

export const FooterButtonText = styled.span`
    margin-left: 7.5px;
`;
