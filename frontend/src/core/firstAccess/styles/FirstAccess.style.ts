import styled from 'styled-components';

import { BackgroundIllustrationContentProps } from '../../authentication/interfaces/BackgroundIllustrationContentProps.interface';

export const HeaderWrapper = styled.header`
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

export const GoBackButton = styled.button`
    background: none;
    cursor: pointer;
    outline: none;
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: #1C70E9;
`;

export const GoBackButtonLabel = styled.span`
    margin-left: 5px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 16px;
`;

export const AuthFormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    padding-top: 30px;
    padding-bottom: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around; 
    background-color: #FFFFFF;
`;

export const AuthBackgroundIllustration = styled.div<BackgroundIllustrationContentProps>`
    height: calc(100vh - 60px); 
    width: 579px;
    background-size: contain;
    background-position: center; 
    background-repeat: no-repeat;
 
    background-image: url(${props => props.src});
`;

export const FormTitle = styled.h4`
    margin-bottom: 20px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 24px;
    color: #171719;
    align-self: flex-start;
`;

export const LoginForm = styled.form`
    height: 421.42px;
    min-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const Label = styled.label`
    position: absolute;
    left: 12px;
    top: 8px;
    line-height: 16.38px;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 10.24px; 
    color: #616161;
    pointer-events: none; 
`;

export const InputWrapper = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 20px;
`;

export const Input = styled.input`
    padding: 18px 12px 8px 12px;
    height: 66.81px;
    width: 100%;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 16px;
    color: #212121;
    border: none;
    outline: none;
    border-radius: 8px;
    background-color: #F5F5F5;
    
        &::placeholder {
            color: #BDBDBD;
        }

        &:focus + ${Label}, &:valid + ${Label} {
            top: 8px;
            font-size: 10.24px; 
            color: #00355D; /* Cor ao focar */
        }
`;

export const EyeIcon = styled.div`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background-color: transparent;
    cursor: pointer;
    outline: none;
    border: none;
`;

export const ErrorList = styled.ul`
    margin-bottom: 20px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 13px;
    color: #A20720;
    align-self: flex-start;
    list-style: none;
`;

export const ErrorListItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const LoginButton = styled.button`
    height: 40px;
    width: 100%;
    background-color: #00355D;
    border-radius: 8px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 16px;
    color: #FFFFFF;
    outline: none;
    border: none;
    cursor: pointer;
`;