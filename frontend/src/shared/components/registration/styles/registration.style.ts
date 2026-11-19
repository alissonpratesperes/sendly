import styled, { css } from 'styled-components';

import { NavigationTabProps } from '../interfaces/navigationTabProps.interface';
import { AnimateButtonHover, AnimateTabIcon } from '../../../styles/animation.style';

export const HeaderWrapper = styled.header`
    margin-top: -214px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const NavigationTabs = styled.nav`
    margin-bottom: 30px;
    height: auto;
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    column-gap: 30px;
    background-color: transparent;
`;

export const NavigationTabButtons = styled.button<{ $active: boolean; $hovered: boolean; }>`
    padding: 15px;
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    border: none;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
    background-color: transparent;
    position: relative;

    cursor: ${ ({ $active }) => $active ? "default" : "pointer" };
    color: ${ ({ $active }) => $active ? "#223463" : "#F0F0F5" };
    background-color: ${ ({ $active }) => $active ? "#F0F0F5" : "#223463" };

        ${ ({ $active }) => !$active && css`
            cursor: pointer;

                &:hover {
                    span {
                        animation: ${ AnimateButtonHover } 0.6s ease-in-out;
                    }

                    svg {
                        animation: ${ AnimateTabIcon } 0.6s ease-in-out;
                    }
                }
        `}

            svg {
                stroke: #1C70E9;
            }

                &::before, &::after {
                    content: "";
                    height: 14px;
                    width: 14px;
                    position: absolute;
                    bottom: 0px;
                    pointer-events: none;
                    opacity: 0;
                }
                &::before {
                    left: -14px;
                    border-radius: 0px 0px 14px 0px;

                    box-shadow: 10px 10px 0 10px ${ ({ $active }) => $active ? "#F0F0F5" : "transparent" };
                }
                &::after {
                    right: -14px;
                    border-radius: 0px 0px 0px 14px;

                    box-shadow: -10px 10px 0 10px ${ ({ $active }) => $active ? "#F0F0F5" : "transparent" };
                }

    ${ ({ $active, $hovered }) => { const showCurves = $active ?? $hovered; return ` z-index: 2; &::before, &::after { opacity: ${ showCurves ? 1 : 0 }; transform: translateY(${ showCurves ? "0" : "100%" }); }`; } };
`;

export const NavigationTabButtonText = styled.span<NavigationTabProps>`
    margin-left: 7.5px;
    font-weight: inherit;
    color: inherit;
`;

export const ContentWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;
