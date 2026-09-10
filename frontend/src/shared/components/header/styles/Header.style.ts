import styled from 'styled-components';
import { NavLink, Link as RouterLink } from 'react-router-dom';

import { UserAvatarContainerProps } from '../interfaces/UserAvatarContainerProps.interface';

export const Container = styled.header`
  padding: 0px 47px 0px 47px;
  height: 96px;
  width: 100vw;
  background-color: #223463;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const CompanyLogotype = styled.img`
    height: 80px;
    width: 125px;
    object-fit: contain;
`;

export const MenuContainer = styled.div`
  width: 539px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content:space-between;
`;

export const Link = styled(RouterLink)`
  font-family: 'Inter';
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
`;

export const NavItem = styled(NavLink)`
  padding-bottom: 6px;
  height: 64px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 6px;
  color: #FFFFFF;

  &.active {
    color: #FFFFFF;

      &::after {
        content: '';
        height: 4px;
        width: 100%;
        position: absolute;
        bottom: 0;
        background-color: #FFFFFF;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
  }

  svg {
    stroke: currentColor;
  }
`;

export const UserAvatarContainer = styled.div<UserAvatarContainerProps>`
  height: 56px;
  width: 56px;
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

export const LogoutClickableContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

export const Dropdown = styled.div`
    padding: 0px 16px 0px 16px;
    position: absolute;
    top: 45px;
    right: 0px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    z-index: 1000;
`;

export const DropdownItem = styled.div`
    height: 64px;
    width: 145px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 16px;
    color: #171719;
    cursor: pointer;
    border-radius: 8px;
`;

export const DropdownText = styled.span`
  margin-left: 8px;
`;