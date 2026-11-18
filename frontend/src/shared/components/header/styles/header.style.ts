import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Phone, PowerOff } from 'lucide-react';

import { headerIconAnimation, buttonHoverAnimation } from '../../../styles/Global.style';

export const Container = styled.header`
  padding: 30px 30px 160px 30px;
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  background-color: #223463;
`;

export const MenuContainer = styled.div`
  padding: 7.5px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  column-gap: 30px;
`;

export const NavItem = styled(NavLink)`
  padding: 15px;
  height: 100%;
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: 7.5px;
  font-family: "Lato";
  font-weight: 700;
  font-size: 16px;
  color: #F0F0F5;
  border-radius: 14px;
  transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

    svg {
        stroke: #1C70E9;
    }

      &:not(.active):hover {
        animation: ${ buttonHoverAnimation } 0.6s ease-in-out;

          svg {
            animation: ${ headerIconAnimation } 0.6s ease-in-out;
          }
      }
      &.active {
        font-weight: 700;
        color: #223463;
        background-color: #F0F0F5;
        cursor: default;
        pointer-events: none;
      }
`;

export const UserContainer = styled.div`
  height: auto;
  width: 450px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 30px;
  text-align: right;
`;

export const UserInformation = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

export const UserName = styled.h1`
  font-family: "Inter";
  font-weight: 900;
  font-size: 18px;
  color: #1C70E9;
`;

export const UserCompany = styled.h1`
  margin-top: 7.5px;
  font-family: "Inter";
  font-weight: 700;
  font-size: 14px;
  color: #F0F0F5;
`;

export const UserActionContainer = styled.div`
  width: auto;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const WhatsAppButton = styled.button`
  padding: 15px;
  height: 100%;
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: 7.5px;
  font-family: "Lato";
  font-weight: 700;
  font-size: 16px;
  color: #F0F0F5;
  outline: none;
  border: none;
  border-radius: 14px;
  background-color: transparent;
  cursor: pointer;
  transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

    svg {
      stroke: #1C70E9;
    }

      &:hover {
        animation: ${ buttonHoverAnimation } 0.6s ease-in-out;

          svg {
            animation: ${ headerIconAnimation } 0.6s ease-in-out;
          }
      }
`;

export const WhatsAppButtonIcon = styled(Phone)`
  height: 25px;
  width: 25px;
`;

export const LogOutButton = styled.button`
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  color: #FF6B00;
  background: rgba(255, 107, 0, 0.25);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;

    svg {
      stroke: currentColor;
    }

      &:hover {
        color: #FFFFFF;
        background: #FF6B00;

        animation: ${ buttonHoverAnimation } 0.6s ease-in-out;
      }
`;

export const LogOutButtonIcon = styled(PowerOff)`
  height: 25px;
  width: 25px;
`;
