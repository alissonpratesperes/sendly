import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { PropagateLoader } from 'react-spinners';
import React, { useState, Fragment } from 'react';
import { EyeIcon, EyeOffIcon, LogInIcon, LockKeyhole } from 'lucide-react';

import * as Styled from '../styles/login.style';
import { login } from '../services/authentication.service';
import { setAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';

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
            <Styled.LoginForm onSubmit={ handleSubmit }>
                <Styled.FormTitle> Bem-vindo ao Sendly </Styled.FormTitle>
                <Styled.FormSubtitle> Para autenticar no sistema, informe suas credenciais abaixo </Styled.FormSubtitle>

                <Styled.InputWrapper>
                    <Styled.Label htmlFor="email"> E-MAIL </Styled.Label>

                    <Styled.Input type="email" id="email" placeholder="Digite seu email" value={ email } onChange={ (inputEvent) => setEmail(inputEvent.target.value) } required />
                </Styled.InputWrapper>
                <Styled.InputWrapper>
                    <Styled.Label htmlFor="password"> SENHA </Styled.Label>

                    <Styled.Input type={ showPassword ? "text" : "password" } id="password" placeholder="Digite sua senha" value={ password } onChange={ (inputEvent) => setPassword(inputEvent.target.value) } required />

                   <Styled.EyeButton type="button" onClick={ togglePasswordVisibility }> { showPassword ? ( <EyeIcon size={ 25 } color="#1C70E9" /> ) : ( <EyeOffIcon size={ 25 } color="#1C70E9" /> ) } </Styled.EyeButton>
                </Styled.InputWrapper>

                <Styled.LoginButtonsContainer>
                    { isLoading ? (
                        <Styled.LoadingContainer>
                            <PropagateLoader size={ 25 } color="#171719" />
                        </Styled.LoadingContainer>
                    ) : (
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
