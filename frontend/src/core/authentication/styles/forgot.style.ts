import styled from 'styled-components';

import { AnimateButtonHover } from '../../../shared/styles/animation.style';

export const ForgotForm = styled.form`
    height: 549px;
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const ForgotButton = styled.button`
    margin-bottom: 90px;
    padding: 15px;
    height: auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 700;
    font-size: 16px;
    color: #223463;
    border: none;
    outline: none;
    border-radius: 14px;
    background-color: #E8EEF8;
    cursor: pointer;
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

export const ForgotButtonText = styled.span`
    margin-left: 7.5px;
`;
