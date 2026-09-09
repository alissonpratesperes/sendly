import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { EyeIcon, EyeOffIcon, LogInIcon } from 'lucide-react';

import * as Styled from '../styles/Authentication.style';
import { ReadById } from '../../user/services/User.service';
import { authenticate } from '../services/authentication.service';
import { decodeJWTUtil } from '../../../shared/utils/jwtDecoderUtil.util';
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

            const response = await authenticate({ email, password });

            if (response.status === StatusCodes.OK) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);

                navigate("/home");
            };
        } catch (error: any) {
            if (error.response?.status === StatusCodes.UNAUTHORIZED) {
                toast.error("Usuário e/ou senha incorretos, tente novamente");

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
            </Styled.LoginForm>
        </Styled.AuthFormContainer>
    );
}

export default Authentication;
