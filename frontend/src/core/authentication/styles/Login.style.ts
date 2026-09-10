import styled from 'styled-components';

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
    height: auto;
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const FormTitle = styled.h4`
    margin-bottom: 15px;
    align-self: flex-start;
    font-family: "Lato";
    font-weight: 700;
    font-size: 25px;
    color: #171719;
`;

export const FormSubtitle = styled.span`
    margin-bottom: 30px;
    align-self: flex-start;
    font-family: "Lato";
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
            border-radius: 14px;
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
    transition: all 0.3s ease;
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
    border-radius: 10px;
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

export const LoginButton = styled.button`
    height: 45px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 700;
    font-size: 16px;
    color: #FFFFFF;
    border: none;
    outline: none;
    border-radius: 10px;
    background-color: #223463;
    cursor: pointer;
    transition: transform 0.2s ease;

        &:hover {
            transform: scale(0.95);
        }
`;

export const LoginButtonText = styled.span`
    margin-left: 7.5px;
`;
