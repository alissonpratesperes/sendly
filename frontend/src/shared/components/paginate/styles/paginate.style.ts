import styled, { css } from 'styled-components';

import { AnimateButtonHover } from '../../../styles/animation.style';

export const PaginateContainer = styled.div`
    margin-top: 30px;
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    column-gap: 30px;
    background-color: transparent;
`;

export const PaginateButton = styled.button`
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 500;
    font-size: 16px;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 14px;
    color: #223463;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover:not(:disabled) {
            color: #F0F0F5;
            background-color: #223463;

            animation: ${ AnimateButtonHover } 0.6s ease-in-out;
        }
        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
`;

export const PreviousButtonText = styled.span`
    display: flex;
    align-items: center;
    font-family: "Lato";
    font-weight: 700;
    font-size: 16px;
`;

export const PagesArrayContainer = styled.div`
    height: auto;
    width: auto;
    display: flex;
    align-items: center;
    column-gap: 7.5px;
`;

export const PageButton = styled.button<{ $active?: boolean; $anotherHovered: boolean; $disableTransition: boolean; }>`
    padding: 15px;
    height: 55px;
    width: 55px;
    font-family: "Lato";
    font-weight: 700;
    font-size: 16px;
    border-radius: 14px;
    border: none;
    outline: none;
    cursor: pointer;
    opacity: 1;

    cursor: ${ ({ $active }) => ($active ? "default" : "pointer") };
    color: ${ ({ $active, $anotherHovered }) => $active && !$anotherHovered ? "#FFFFFF" : "#223463" };
    background-color: ${ ({ $active, $anotherHovered }) => $active && !$anotherHovered ? "#223463" : "transparent" };
    transition: ${ ({ $disableTransition }) => $disableTransition ? "none" : "font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease" };

        &:hover {
            animation: none;
        }

            ${ ({ $active }) => !$active &&
                css` &:hover {
                    font-weight: 700;
                    color: #FFFFFF;
                    background-color: #223463;

                    animation: ${ AnimateButtonHover } 0.6s ease-in-out;
                }`
            }
`;

export const NextButtonText = styled.span`
    display: flex;
    align-items: center;
    font-family: "Lato";
    font-weight: 700;
    font-size: 16px;
`;
