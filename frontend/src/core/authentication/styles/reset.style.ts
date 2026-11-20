import styled from 'styled-components';

import { AnimateButtonHover } from '../../../shared/styles/animation.style';

export const ResetForm = styled.form`
    height: auto;
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const EyeButton = styled.button`
    padding: 0;
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    z-index: 2;

        svg {
            stroke: #FF6B00;
        }
`;

export const PasswordButton = styled.button`
    padding: 15px;
    height: auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Orbitron";
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

export const PasswordButtonText = styled.span`
    margin-left: 7.5px;
`;
