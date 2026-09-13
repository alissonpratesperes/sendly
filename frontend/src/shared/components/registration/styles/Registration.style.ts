import styled from 'styled-components';

import { NavigationTabProps } from '../interfaces/NavigationTabProps.interface';

export const HeaderWrapper = styled.header`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;

export const SessionInformationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;

export const SessionTitle = styled.h1`
    margin-bottom: 7.5px;
    align-self: flex-start;
    font-family: "Inter";
    font-weight: 700;
    font-size: 25px;
    color: #171719;
`;

export const SessionSubtitle = styled.span`
    margin-bottom: 15px;
    align-self: flex-start;
    font-family: "Inter";
    font-weight: 400;
    font-size: 14px;
    color: #525059;
`;

export const NavigationTabs = styled.nav`
    padding: 15px 0px 0px 0px;
    height: auto;
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    column-gap: 30px;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
`;

export const NavigationTabButtons = styled.button<NavigationTabProps>`
    padding: 15px 15px;
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    border: none;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
    background-color: transparent;
    transition: color 0.3s ease, font-weight 0.3s, background-color 0.3s ease;

    font-weight: ${({ $active }) => $active ? 700 : 400};
    color: ${({ $active }) => $active ? "#223463" : "#223463"};
    background-color: ${({ $active }) => $active ? "#D9DCE3" : "transparent"};

        &:hover {
            ${({ $active }) => !$active && `
                font-weight: 700;
                color: #223463;
                background-color: #D9DCE3;
            `}
        }
`;

export const NavigationTabButtonText = styled.span<NavigationTabProps>`
    margin-left: 7.5px;
    font-family: "Inter";
    font-weight: inherit;
    font-size: 16px;
    color: inherit;
`;
