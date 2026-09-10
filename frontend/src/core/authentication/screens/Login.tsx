import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { EyeIcon, EyeOffIcon, LogInIcon } from 'lucide-react';

import * as Styled from '../styles/Login.style';
import { login } from '../services/authentication.service';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';

const Authentication: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        try {
            showLoading();

            const response = await login({ email, password });

            localStorage.setItem("accessToken", response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);

            toast.info("Login realizado com sucesso, bem-vindo ao Sendly");

            navigate("/home");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === StatusCodes.BAD_REQUEST) {
                toast.warn("É necessário redefinir a primeira senha, verifique seu e-mail");
            } else if (axios.isAxiosError(error) && error.response?.status === StatusCodes.UNAUTHORIZED) {
                toast.error("Credenciais inválidas, tente novamente");

                return;
            } else {
                toast.error("Não é possível realizar a autenticação");
            }
        } finally {
            hideLoading();
        }
    }

    return (
        <Styled.AuthFormContainer>
            <Styled.LoginForm onSubmit={handleSubmit}>
                <Styled.FormTitle> Bem-vindo ao Sendly </Styled.FormTitle>
                <Styled.FormSubtitle> Para autenticar no sistema, informe suas credenciais abaixo </Styled.FormSubtitle>

                <Styled.InputWrapper>
                    <Styled.Label htmlFor="email"> E-MAIL </Styled.Label>

                    <Styled.Input type="email" id="email" placeholder="Digite seu email" value={email} onChange={(inputEvent) => setEmail(inputEvent.target.value)} required />
                </Styled.InputWrapper>
                <Styled.InputWrapper>
                    <Styled.Label htmlFor="password"> SENHA </Styled.Label>

                    <Styled.Input type={showPassword ? "text" : "password"} id="password" placeholder="Digite sua senha" value={password} onChange={(inputEvent) => setPassword(inputEvent.target.value)} required />

                   <Styled.EyeButton type="button" onClick={togglePasswordVisibility}> {showPassword ? ( <EyeIcon size={20} color="#223463" /> ) : ( <EyeOffIcon size={20} color="#223463" /> )} </Styled.EyeButton>
                </Styled.InputWrapper>

                <Styled.LoginButton type="submit"> <LogInIcon size={20} color="#FFFFFF" /> <Styled.LoginButtonText> Fazer login </Styled.LoginButtonText> </Styled.LoginButton>

                <Styled.CompanyPresentation>
                    <Styled.CopyrightParagraph> © 2026 Sendly | Todos os direitos reservados </Styled.CopyrightParagraph>
                </Styled.CompanyPresentation>
            </Styled.LoginForm>
        </Styled.AuthFormContainer>
    );
}

export default Authentication;
