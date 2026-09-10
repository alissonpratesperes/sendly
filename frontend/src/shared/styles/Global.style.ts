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
`;

export const Main = styled("main").withConfig({ shouldForwardProp: (prop) => isPropValid(prop) && prop !== "applyPadding" }) <{ applyPadding?: boolean; }>`
    ${({ applyPadding }) => applyPadding && css` padding: 40px 70px 40px 70px; `}
`;