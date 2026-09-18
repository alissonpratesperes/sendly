import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import React, { useState, Fragment } from 'react';
import { EyeIcon, EyeOffIcon, LogInIcon, LockKeyhole } from 'lucide-react';

import * as Styled from '../styles/login.style';
import { login } from '../services/authentication.service';
import { setAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';

const Authentication: React.FC = () => {
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

            const response = await login({ email, password });

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
        <Styled.AuthFormContainer>
            <Styled.BackgroundWave viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#223463" fill-opacity="1" d="M0,192L80,160C160,128,320,64,480,80C640,96,800,192,960,202.7C1120,213,1280,139,1360,101.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </Styled.BackgroundWave>

            <Styled.LoginForm onSubmit={ handleSubmit }>
                <Styled.ApplicationBrandContainer> <Styled.ApplicationBrandMark> Sendly </Styled.ApplicationBrandMark> </Styled.ApplicationBrandContainer>

                <Styled.FormTitle> Bem-vindo </Styled.FormTitle>
                <Styled.FormSubtitle> Para autenticar no sistema, informe suas credenciais abaixo </Styled.FormSubtitle>

                <Styled.InputWrapper>
                    <Styled.Label htmlFor="email"> E-MAIL </Styled.Label>

                    <Styled.Input type="email" id="email" placeholder="Digite seu email" value={ email } onChange={ (inputEvent) => setEmail(inputEvent.target.value) } required />
                </Styled.InputWrapper>
                <Styled.InputWrapper>
                    <Styled.Label htmlFor="password"> SENHA </Styled.Label>

                    <Styled.Input type={ showPassword ? "text" : "password" } id="password" placeholder="Digite sua senha" value={ password } onChange={ (inputEvent) => setPassword(inputEvent.target.value) } required />

                   <Styled.EyeButton type="button" onClick={ togglePasswordVisibility }> { showPassword ? ( <EyeIcon size={ 25 } color="#238636" /> ) : ( <EyeOffIcon size={ 25 } color="#238636" /> ) } </Styled.EyeButton>
                </Styled.InputWrapper>

                <Styled.LoginButtonsContainer>
                    { isLoading && (
                        <LoadingState/>
                    ) }
                    { !isLoading && (
                        <Fragment>
                            <Styled.ForgotButton to="/authentication/forgot">
                                <LockKeyhole size={ 25 } color="#FFFFFF" />

                                <Styled.ForgotButtonText> Recuperar senha </Styled.ForgotButtonText>
                            </Styled.ForgotButton>
                            <Styled.LoginButton type="submit">
                                <LogInIcon size={ 25 } />

                                <Styled.LoginButtonText> Fazer login </Styled.LoginButtonText>
                            </Styled.LoginButton>
                        </Fragment>
                    ) }
                </Styled.LoginButtonsContainer>

                <Styled.CompanyPresentation>
                    <Styled.CopyrightParagraph> © 2026 Sendly | Todos os direitos reservados </Styled.CopyrightParagraph>
                </Styled.CompanyPresentation>
            </Styled.LoginForm>
        </Styled.AuthFormContainer>
    );
}

export default Authentication;
