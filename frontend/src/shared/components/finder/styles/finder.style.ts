import styled from 'styled-components';

import { AnimateButtonHover } from '../../../styles/animation.style';

export const SearchInputWrapper = styled.div<{ $isSystemRoot: boolean; }>`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    column-gap: ${ ({ $isSystemRoot }) => $isSystemRoot ? "30px" : "0px" };
`;

export const SearchInputContainer = styled.div`
    padding: 0px 15px;
    height: auto;
    width: 100%;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    border-radius: 14px;
    background-color: #FFFFFF;

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

export const SearchInputField = styled.input`
    margin-left: 15px;
    height: 55px;
    width: 100% !important;
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

export const AddButton = styled.button`
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Orbitron";
    font-weight: 700;
    font-size: 16px;
    border: none;
    outline: none;
    cursor: pointer;
    color: #238636;
    background-color: #E6F4EA;
    transition: color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #FFFFFF;
            background-color: #238636;

            animation: ${ AnimateButtonHover } 0.6s ease-in-out;
        }
`;

export const SearchInputSubmitText = styled.span`
    margin-left: 7.5px;
`;
