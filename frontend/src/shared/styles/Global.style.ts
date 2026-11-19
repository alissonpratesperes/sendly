import isPropValid from '@emotion/is-prop-valid';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';

export const navigationTabIconAnimation = keyframes`
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(-14deg); }
    40% { transform: rotate(14deg); }
    60% { transform: rotate(-12deg); }
    80% { transform: rotate(12deg); }
`;

export const headerIconAnimation = keyframes`
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-14deg); }
  40% { transform: rotate(14deg); }
  60% { transform: rotate(-12deg); }
  80% { transform: rotate(12deg); }
`;

export const buttonHoverAnimation = keyframes`
    0% { transform: scale(1.08); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
`;

export const drawerOpenAnimation = keyframes`
    0% { transform: translateX(calc(100% + 30px)); }
    70% { transform: translateX(-15px); }
    100% { transform: translateX(0); }
`;

export const drawerCloseAnimation = keyframes`
    0% { transform: translateX(0); }
    30% { transform: translateX(-15px); }
    100% { transform: translateX(calc(100% + 30px)); }
`;

export const modalOpenAnimation = keyframes`
    0% { transform: translateY(100px) scale(0.9); }
    70% { transform: translateY(-10px) scale(1.02); }
    100% { transform: translateY(0) scale(1); }
`;

export const modalCloseAnimation = keyframes`
    0% { transform: translateY(0) scale(1); }
    30% { transform: translateY(-10px) scale(1.02); }
    100% { transform: translateY(100px) scale(0.9); }
`;

export const whatsAppPreviewOpenAnimation = keyframes`
    0% { transform: scale(0.75) translateX(40px); opacity: 0; }
    60% { transform: scale(1.03) translateX(0); opacity: 1; }
    100% { transform: scale(1) translateX(0); opacity: 1; }
`;

export const whatsAppPreviewCloseAnimation = keyframes`
    0% { transform: scale(1) translateX(0); opacity: 1; }
    40% { transform: scale(1.03) translateX(0); opacity: 1; }
    100% { transform: scale(0.75) translateX(40px); opacity: 0; }
`;

export const whatsAppMesssagePopAnimation = keyframes`
    0% { transform: scale(1.08); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
`;

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0px 0px 0px 0px;
        padding: 0px 0px 0px 0px;
        box-sizing: border-box;
    }

    html, body {
        font-family: "Inter", Arial, sans-serif;
        background-color: #F0F0F5;
        color: #171719;
        overflow-x: hidden;
    }

    a {
        text-decoration: none;
    }

    button {
        &:first-child {
            border-top-left-radius: 14px;
            border-bottom-left-radius: 14px;
        }
        &:last-child {
            border-top-right-radius: 14px;
            border-bottom-right-radius: 14px;
        }
        &:only-child {
            border-radius: 14px;
        }
    }
`;

export const Main = styled("main").withConfig({ shouldForwardProp: (prop) => isPropValid(prop) && prop !== "applyPadding" }) <{ applyPadding?: boolean; }>`
    ${ ({ applyPadding }) => applyPadding && css` padding: 40px 30px 40px 30px;` };
`;

export const Footer = styled.footer`
    margin-top: 60px;
    height: 160px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    background-color: #223463;
`;

export const FooterContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 30px;
`;
