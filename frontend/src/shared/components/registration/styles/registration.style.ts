import styled from 'styled-components';

import { NavigationTabProps } from '../interfaces/navigationTabProps.interface';

export const HeaderWrapper = styled.header`
    margin-top: -183.5px;
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
    height: auto;
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    column-gap: 30px;
    background-color: transparent;
`;

export const NavigationTabButtons = styled.button<{ $active: boolean; $hovered: boolean; $anotherHovered: boolean; }>`
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
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
    background-color: transparent;
    transition: font-weight 0.3s, color 0.3s ease, background-color 0.3s ease;

    font-weight: ${ ({ $active, $anotherHovered }) => $active && !$anotherHovered ? 700 : 500 };
    color: ${ ({ $active, $anotherHovered }) => $active && !$anotherHovered ? "#223463" : "#F0F0F5" };
    background-color: ${ ({ $active, $anotherHovered }) => $active && !$anotherHovered ? "#F0F0F5" : "#223463" };

        &:hover {
            ${ ({ $active }) => !$active && `
                font-weight: 700;
                color: #223463;
                background-color: #F0F0F5;
            `}
        }

            svg {
                stroke: #1C70E9;
            }
`;

export const NavigationTabButtonText = styled.span<NavigationTabProps>`
    margin-left: 7.5px;
    font-weight: inherit;
    color: inherit;
`;
