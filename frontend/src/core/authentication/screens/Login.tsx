import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import React, { useState, Fragment } from 'react';

import * as S from '../styles/login.style';
import * as I from '../../../shared/styles/icon.style';
import * as G from '../../../shared/styles/global.style';

import { Login } from '../services/authentication.service';
import { setAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';

export const Authentication: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        try {
            setIsLoading(true);

            const response = await Login({ email, password });

            setAuthenticationStorage(response);

            toast.info("Login realizado com sucesso");

            navigate("/home");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === StatusCodes.BAD_REQUEST) {
                toast.warn("É necessário redefinir a primeira senha, verifique seu e-mail");

                return;
            } else if (axios.isAxiosError(error) && error.response?.status === StatusCodes.UNAUTHORIZED) {
                toast.error("Credenciais inválidas, tente novamente");

                return;
            } else {
                toast.error("Não é possível realizar a autenticação");

                return;
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <G.FormContainer>
            <S.LoginForm onSubmit={ handleSubmit }>
                <G.FormTitle> Bem-vindo </G.FormTitle>
                <G.FormSubtitle> Para autenticar no sistema, informe suas credenciais abaixo </G.FormSubtitle>

                <G.InputWrapper>
                    <G.Label htmlFor="email"> E-MAIL </G.Label>

                    <G.Input type="email" id="email" placeholder="Digite seu email" value={ email } onChange={ (inputEvent) => setEmail(inputEvent.target.value) } required/>
                </G.InputWrapper>
                <G.InputWrapper>
                    <G.Label htmlFor="password"> SENHA </G.Label>

                    <G.Input type={ showPassword ? "text" : "password" } id="password" placeholder="Digite sua senha" value={ password } onChange={ (inputEvent) => setPassword(inputEvent.target.value) } required/>

                   <S.EyeButton type="button" onClick={ togglePasswordVisibility }> { showPassword ? ( <I.EyeIconIcon/> ) : ( <I.EyeOffIconIcon/> ) } </S.EyeButton>
                </G.InputWrapper>

                <G.ButtonsContainer $isInLoginScreen={ true }>
                    { isLoading && (
                        <LoadingState/>
                    ) }
                    { !isLoading && (
                        <Fragment>
                            <S.ForgotButton to="/authentication/forgot">
                                <I.LockOpenIcon/>

                                <S.ForgotButtonText> Recuperar senha </S.ForgotButtonText>
                            </S.ForgotButton>
                            <S.LoginButton type="submit">
                                <I.PowerIcon/>

                                <S.LoginButtonText> Autenticar </S.LoginButtonText>
                            </S.LoginButton>
                        </Fragment>
                    ) }
                </G.ButtonsContainer>
            </S.LoginForm>
        </G.FormContainer>
    );
}
