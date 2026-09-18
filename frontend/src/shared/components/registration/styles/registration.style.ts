import styled from 'styled-components';

import { NavigationTabProps } from '../interfaces/navigationTabProps.interface';

export const HeaderWrapper = styled.header`
    margin-top: -170px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const SessionInformationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const SessionTitle = styled.h1`
    margin-bottom: 7.5px;
    font-family: "Inter";
    font-weight: 900;
    font-size: 25px;
    color: #1C70E9;
`;

export const SessionSubtitle = styled.span`
    margin-bottom: 30px;
    align-self: flex-start;
    font-family: "Inter";
    font-weight: 500;
    font-size: 18px;
    color: #1C70E9;
`;

export const NavigationTabs = styled.nav`
    margin-bottom: 30px;
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    column-gap: 15px;
    border-radius: 14px;
    background-color: #E6E7EC;
`;

export const NavigationTabButtons = styled.button<NavigationTabProps>`
    padding: 15px;
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-size: 16px;
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 14px;
    background-color: transparent;
    transition: font-weight 0.3s, color 0.3s ease, background-color 0.3s ease;

    font-weight: ${ ({ $active }) => ($active ? 700 : 400) };
    color: ${ ({ $active }) => $active ? "#FFFFFF" : "#223463" };
    background-color: ${ ({ $active }) => $active ? "#223463" : "#E6E7EC" };

        &:hover {
            ${ ({ $active }) => !$active && `
                font-weight: 700;
                color: #FFFFFF;
                background-color: #223463;
                animation: navigationTabButtonEffect 0.6s ease-in-out;
            ` }
        }

            svg {
                stroke: currentColor;
            }

                @keyframes navigationTabButtonEffect {
                    0% {
                        transform: scale(1.08);
                    }

                    50% {
                        transform: scale(0.95);
                    }

                    100% {
                        transform: scale(1);
                    }
                }
`;

export const NavigationTabButtonText = styled.span<NavigationTabProps>`
    margin-left: 7.5px;
    font-weight: inherit;
    color: inherit;
`;
