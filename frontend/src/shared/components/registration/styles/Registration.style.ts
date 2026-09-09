import styled from 'styled-components';

import { NavigationTabProps } from '../interfaces/NavigationTabProps.interface';

export const NavigationTabs = styled.nav`
    margin-bottom: 16px;
    height: 66px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-bottom: 1px solid #D3D2D9;
`;

export const NavigationTabButtons = styled.button<NavigationTabProps>`
    padding: 0px 14.75px 0px 14.75px;
    height: 66px;
    position: relative;
    background: none;
    cursor: pointer;
    outline: none;
    border: none;
    
        &::after {
            content: '';
            height: 2px;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 1px;
            background-color: ${({ $active }) => ($active ? '#1C70E9' : 'transparent')};
        }
`;

export const NavigationTabButtonText = styled.span<NavigationTabProps>`
    font-family: 'Lato';
    font-size: 16px;
    font-weight: ${({ $active }) => $active ? '700' : '400'};
`;