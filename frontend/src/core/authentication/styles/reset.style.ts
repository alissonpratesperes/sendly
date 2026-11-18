import styled from 'styled-components';
import { EyeIcon, EyeOffIcon, UserLock } from 'lucide-react';

import { buttonHoverAnimation } from '../../../shared/styles/Global.style';

export const ResetFormContainer = styled.div`
    position: relative;
    height: calc(100vh - 220px);
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background-color: #F0F0F5;
`;

export const ResetForm = styled.form`
    height: auto;
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const FormTitle = styled.h4`
    margin-bottom: 15px;
    align-self: flex-start;
    font-family: "Inter";
    font-weight: 900;
    font-size: 25px;
    color: #171719;
`;

export const FormSubtitle = styled.span`
    margin-bottom: 30px;
    align-self: flex-start;
    font-family: "Inter";
    font-weight: 700;
    font-size: 18px;
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

export const Label = styled.label`
    position: absolute;
    left: 15px;
    top: 7.5px;
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

export const EyeButtonIconOpened = styled(EyeIcon)`
    height: 25px;
    width: 25px;
`;

export const EyeButtonIconClosed = styled(EyeOffIcon)`
    height: 25px;
    width: 25px;
`;

export const PasswordButton = styled.button`
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

                animation: ${ buttonHoverAnimation } 0.6s ease-in-out;
            }
`;

export const PasswordButtonIcon = styled(UserLock)`
    height: 25px;
    width: 25px;
`;

export const PasswordButtonText = styled.span`
    margin-left: 7.5px;
`;
