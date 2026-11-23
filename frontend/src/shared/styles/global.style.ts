import isPropValid from '@emotion/is-prop-valid';
import styled, { createGlobalStyle, css } from 'styled-components';

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

export const FormContainer = styled.div`
    position: relative;
    height: calc(100vh - 220px);
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background-color: transparent;
`;

export const FormTitle = styled.h4`
    margin-bottom: 15px;
    align-self: flex-start;
    font-family: "Orbitron";
    font-weight: 900;
    font-size: 25px;
    color: #171719;
`;

export const FormSubtitle = styled.span`
    margin-bottom: 30px;
    text-align: justify;
    font-family: "Orbitron";
    font-weight: 700;
    font-size: 16px;
    color: #525059;
`;

export const InputWrapper = styled.div`
    margin-bottom: 30px;
    width: 100%;
    position: relative;

        &::before {
            content: "";
            position: absolute;
            inset: -6px;
            border-radius: 18px;
            border: 2px solid #FF6B00;
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

export const SessionInformationWrapper = styled.div<{ $isInHomeScreen?: boolean; }>`
    margin-top: ${ ({ $isInHomeScreen }) => $isInHomeScreen ? "-30px" : "0px" };
    margin-bottom: 28px;
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

export const SessionTitle = styled.h1`
    margin-bottom: 7.5px;
    font-family: "Orbitron";
    font-weight: 900;
    font-size: 25px;
    color: #1C70E9;
`;

export const SessionSubtitle = styled.span`
    margin-bottom: 30px;
    align-self: flex-start;
    font-family: "Orbitron";
    font-weight: 700;
    font-size: 18px;
    color: #F0F0F5;
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

export const ButtonsContainer = styled.div<{ $isInLoginScreen?: boolean; }>`
    width: ${ ({ $isInLoginScreen }) => $isInLoginScreen ? "100%" : "auto" };

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
`;

export const Footer = styled.footer`
    margin-top: 90px;
    padding-bottom: 30px;
    height: auto;
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
