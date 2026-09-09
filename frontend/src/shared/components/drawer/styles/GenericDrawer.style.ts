import { styled } from "styled-components";

import { GenericDrawerOverlayProps } from "../interfaces/GenericDrawerOverlayProps.interface";

export const DrawerOverlay = styled.div<GenericDrawerOverlayProps>`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
    
    display: ${({ $open }) => ($open ? 'block' : 'none')};
`;

export const Drawer = styled.div`
    max-height: 100vh;
    height: 100%;
    width: 498px;
    max-width: 100%;
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
`;

export const Header = styled.div`
    height: 56px;
    padding: 16px 16px 16px 16px;
    margin-bottom: 29px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #E9EAEB;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 16px;
    overflow-y: auto;
`;

export const Title = styled.h2`
    font-family: 'Lato';
    font-weight: 700;
    font-size: 16px;
    color: #171719;
`;

export const CloseButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 16px;
    overflow-y: visible;
`;

export const FieldWrapper = styled.div`
    padding: 0px 32px 0px 32px;
    display: flex;
    flex-direction: column;
`;

export const RequiredLabel = styled.label<{ required?: boolean }>`
    position: relative;
    display: inline-block;
    margin-bottom: 8px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 14px;
    color: #171719;

    padding-left: ${({ required }) => (required ? '8px' : '0px')};
    ${({ required }) => required && `
        &::before {
            content: '*';
            position: absolute;
            left: 0;
            top: 0;
            color: #FF0000;
            font-weight: 700;
            font-size: 14px;
            line-height: 1;
            transform: translateY(12%);
        }
  `}
`;

export const Label = styled.label`
    margin-bottom: 8px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 14px;
    color: #171719;
`;

export const Input = styled.input`
    padding: 8px 8px 8px 8px;
    height: 40px;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 16px;
    border: 1px solid #D3D2D9;
    border-radius: 8px;

        &::placeholder {
            font-family: 'Lato';
            font-weight: 400;
            font-size: 16px;
            color: #767380;
        }   
`;

export const Select = styled.select`
    padding: 8px 8px 8px 8px;
    height: 40px;
    border: 1px solid #D3D2D9;
    border-radius: 8px;
`;

export const Footer = styled.div`
    margin-top: auto;
    padding: 16px 16px 16px 16px;
    height: 72px;
    column-gap: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0px -2px 16px rgba(0, 0, 0, 0.08);
`;

export const FooterButton = styled.button<{ $variant?: 'primary' | 'secondary'; $formType?: 'default' | 'action'; }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 16px;

    height: ${({ $variant }) => ($variant === 'primary' ? '40px' : '40px')};
    color: ${({ $variant }) => ($variant === 'primary' ? '#FFFFFF' : '#171719')};
    background-color: ${({ $variant }) => ($variant === 'primary' ? '#00355D' : 'transparent')};
    width: ${({ $variant, $formType }) => $variant === 'primary' ? $formType === 'action' ? '192px' : '162px' : '94px'};
`;