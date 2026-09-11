import styled from 'styled-components';
import { NavLink, Link as RouterLink } from 'react-router-dom';

export const Container = styled.header`
  padding: 35px 70px 0px 70px;
  height: 100px;
  width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MenuContainer = styled.div`
  width: 500px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content:space-between;
`;

export const NavItem = styled(NavLink)`
  padding: 15px;
  height: 100%;
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 7.5px;
  font-family: "Inter";
  font-weight: 400;
  font-size: 16px;
  color: #223463;
  border-radius: 14px;
  transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

    &:not(.active):hover {
      font-weight: 700;
      color: #FFFFFF;
      background-color: #223463;
      animation: menuEffect 0.6s ease-in-out;
    }

    &.active {
      font-weight: 700;
      color: #FFFFFF;
      background-color: #223463;
    }

      svg {
        stroke: currentColor;
      }

        @keyframes menuEffect {
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

export const UserContainer = styled.div`
  padding-right: 15px;
  height: 80px;
  width: 350px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  background-color: #D9DCE3;
  border-radius: 50px;
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
  font-weight: 700;
  font-size: 18px;
  color: #000000;
`;

export const UserCompany = styled.h1`
  margin-top: 7.5px;
  font-family: "Inter";
  font-weight: 500;
  font-size: 14px;
  color: #223463;
`;

export const UserActionContainer = styled.div`
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
`;

export const LogOutButton = styled.button`
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background-color: #FFFFFF;
  color: #223463;
  cursor: pointer;
  transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

    &:hover {
      color: #FFFFFF;
      background-color: #223463;
      animation: logOutButtonEffect 0.6s ease-in-out;
    }

      svg {
        stroke: currentColor;
      }

        @keyframes logOutButtonEffect {
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
