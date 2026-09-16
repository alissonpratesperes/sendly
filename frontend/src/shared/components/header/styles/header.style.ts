import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Container = styled.header`
  margin: 0px 30px 0px 30px;
  padding: 20px 30px 200px 30px;
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #223463;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
`;

export const ApplicationBrandContainer = styled.div`
  height: 100%;
  width: auto;
`;

export const ApplicationBrandMark = styled.p`
  font-family: "Alien Block";
  font-weight: 400;
  font-size: 55px;
  color: #FFFFFF;
`;

export const MenuContainer = styled.div`
  width: 500px;
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
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
  border-radius: 14px;
  transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

    &:not(.active):hover {
      font-weight: 700;
      color: #223463;
      background-color: #F0F0F5;
      animation: menuEffect 0.6s ease-in-out;
    }
    &.active {
      font-weight: 700;
      color: #223463;
      background-color: #F0F0F5;
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
  height: 80px;
  width: 350px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30px;
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
  color: #F0F0F5;
`;

export const UserCompany = styled.h1`
  margin-top: 7.5px;
  font-family: "Inter";
  font-weight: 400;
  font-size: 12px;
  color: #F0F0F5;
`;

export const UserActionContainer = styled.div`
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const LogOutButton = styled.button`
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  border-radius: 14px;
  background: none;
  color: #DC143C;
  cursor: pointer;
  transition: opacity 0.3s ease, opacity 0.3s ease, opacity 0.3s ease;

    &:hover {
      background: #DC143C;
      color: #FFFFFF;
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
