import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { AnimateButtonHover } from '../../../shared/styles/animation.style';

export const LoginForm = styled.form`
    position: relative;
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

export const ForgotButton = styled(Link)`
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Orbitron";
    font-weight: 700;
    font-size: 16px;
    color: #FF6B00;
    border: none;
    outline: none;
    background: rgba(255, 107, 0, 0.25);
    cursor: pointer;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #FFFFFF;
            background-color: #FF6B00;

            animation: ${ AnimateButtonHover } 0.6s ease-in-out;
        }

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
`;

export const ForgotButtonText = styled.span`
    margin-left: 7.5px;
`;

export const LoginButton = styled.button`
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Orbitron";
    font-weight: 700;
    font-size: 16px;
    color: #223463;
    border: none;
    outline: none;
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

export const LoginButtonText = styled.span`
    margin-left: 7.5px;
`;
