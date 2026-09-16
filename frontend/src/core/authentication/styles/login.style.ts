import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const LoadingContainer = styled.div`
    height: 55px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: transparent;
`;

export const AuthFormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background-color: #F0F0F5;
`;

export const LoginForm = styled.form`
    position: relative;
    height: auto;
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const ApplicationBrandContainer = styled.div`
    margin-bottom: 60px;
    height: 100px;
    width: 100%;
    display: flex;
    flex-drection: row;
    align-items: center;
    justify-content: center;
`;

export const ApplicationBrandMark = styled.p`
    font-family: "Alien Block";
    font-weight: 400;
    font-size: 85px;
    color: #9CA3AF;
`;

export const FormTitle = styled.h4`
    margin-bottom: 15px;
    align-self: flex-start;
    font-family: "Inter";
    font-weight: 700;
    font-size: 25px;
    color: #171719;
`;

export const FormSubtitle = styled.span`
    margin-bottom: 30px;
    align-self: flex-start;
    font-family: "Inter";
    font-weight: 400;
    font-size: 14px;
    color: #525059;
`;

export const InputWrapper = styled.div`
    margin-bottom: 30px;
    width: 100%;
    position: relative;

        &::before {
            content: "";
            position: absolute;
            inset: -6px;
            border-radius: 18px;
            border: 2px solid #223463;
            opacity: 0;
            transform: scale(1.08);
            transition: transform 0.3s ease, opacity 0.3s ease;
            pointer-events: none;
        }
        &:focus-within::before {
            opacity: 1;
            transform: scale(1);
        }
`;

export const Label = styled.label`
    position: absolute;
    left: 15px;
    top: 7.5px;
    font-family: "Lato";
    font-weight: 700;
    font-size: 12px;
    color: #223463;
    pointer-events: none;
`;

export const Input = styled.input`
    padding: 15px 15px 0px 15px;
    height: 60px;
    width: 100%;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
    color: #212121;
    border: none;
    outline: none;
    background-color: #FFFFFF;
    border-radius: 14px;
    z-index: 1;

        &::placeholder {
            color: #BDBDBD;
        }
`;

export const EyeButton = styled.button`
    padding: 0;
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    z-index: 2;
`;

export const LoginButtonsContainer = styled.div`
    height: auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const LoginButton = styled.button`
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
    color: #223463;
    border: none;
    outline: none;
    border-radius: 14px;
    background-color: transparent;
    cursor: pointer;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover {
            font-weight: 700;
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

export const LoginButtonText = styled.span`
    margin-left: 7.5px;
`;

export const ForgotButton = styled(Link)`
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
    color: #DC143C;
    border: none;
    outline: none;
    border-radius: 14px;
    background-color: transparent;
    cursor: pointer;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover {
            font-weight: 700;
            color: #FFFFFF;
            background-color: #DC143C;
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

export const ForgotButtonText = styled.span`
    margin-left: 7.5px;
`;

export const CompanyPresentation = styled.div`
    margin-top: 45px;
`;

export const CopyrightParagraph = styled.p`
    font-family: "Inter";
    font-weight: 500;
    font-size: 14px;
    color: #9CA3AF;
`;
