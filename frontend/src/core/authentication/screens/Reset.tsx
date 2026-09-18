import axios from 'axios';
import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';
import React, { useEffect, useState } from 'react';
import { EyeIcon, EyeOffIcon, UserLock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import * as Styled from '../styles/reset.style';
import { reset } from '../services/authentication.service';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';

const Reset: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const passwordResetToken = searchParams.get("passwordResetToken");

    useEffect(() => {
        if (!passwordResetToken) {
            toast.error("Link de redefinição de senha inválido");

            navigate('/authentication', { replace: true });
        }
    }, [passwordResetToken, navigate]);

    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        if (!passwordResetToken) {
            toast.error("Token de redefinição de senha inválido");

            return;
        }

        try {
            setIsLoading(true);

            await reset(passwordResetToken, { newPassword, confirmPassword });

            toast.success("Nova senha definida com sucesso");

            setIsLoading(false);

            navigate("/authentication", { replace: true });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === StatusCodes.BAD_REQUEST) {
                toast.error("As senhas não coincidem");

                setIsLoading(false);

                return;
            } else if(axios.isAxiosError(error) && error.response?.status === StatusCodes.UNAUTHORIZED)  {
                toast.error("Token de redefinição de senha inválido");

                setIsLoading(false);

                return;
            } else {
                toast.error("Não é possível definir a nova senha");

                setIsLoading(false);

                return;
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Styled.ResetFormContainer>
            <Styled.BackgroundWave viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#223463" fill-opacity="1" d="M0,192L80,160C160,128,320,64,480,80C640,96,800,192,960,202.7C1120,213,1280,139,1360,101.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </Styled.BackgroundWave>

            <Styled.ResetForm onSubmit={handleSubmit}>
                <Styled.ApplicationBrandContainer> <Styled.ApplicationBrandMark> Sendly </Styled.ApplicationBrandMark> </Styled.ApplicationBrandContainer>

                <Styled.FormTitle> Definir uma nova senha </Styled.FormTitle>
                <Styled.FormSubtitle> Para redefinir sua senha, utilize os campos abaixo </Styled.FormSubtitle>

                <Styled.InputWrapper>
                    <Styled.Label htmlFor="newPassword"> NOVA SENHA </Styled.Label>

                    <Styled.Input type={ showPassword ? "text" : "password" } id="newPassword" placeholder="Digite sua nova senha" value={ newPassword } onChange={ (inputEvent) => setNewPassword(inputEvent.target.value) } required />

                    <Styled.EyeButton type="button" onClick={ () => setShowPassword(!showPassword) }> { showPassword ? ( <EyeIcon size={25} color="#238636" /> ) : ( <EyeOffIcon size={25} color="#238636" /> ) } </Styled.EyeButton>
                </Styled.InputWrapper>
                <Styled.InputWrapper>
                    <Styled.Label htmlFor="confirmPassword"> CONFIRMAR NOVA SENHA </Styled.Label>

                    <Styled.Input type={ showConfirmPassword ? "text" : "password" } id="confirmPassword" placeholder="Confirme sua nova senha" value={ confirmPassword } onChange={ (inputEvent) => setConfirmPassword(inputEvent.target.value) } required />

                    <Styled.EyeButton type="button" onClick={ () => setShowConfirmPassword(!showConfirmPassword) }> { showConfirmPassword ? ( <EyeIcon size={25} color="#238636" /> ) : ( <EyeOffIcon size={25} color="#238636" /> ) } </Styled.EyeButton>
                </Styled.InputWrapper>

                { isLoading && (
                    <LoadingState/>
                ) }
                { !isLoading && (
                    <Styled.PasswordButton type="submit">
                        <UserLock size={ 25 } color="#FFFFFF" />

                        <Styled.PasswordButtonText> Criar senha </Styled.PasswordButtonText>
                    </Styled.PasswordButton>
                ) }

                <Styled.CompanyPresentation>
                    <Styled.CopyrightParagraph> © 2026 Sendly | Todos os direitos reservados </Styled.CopyrightParagraph>
                </Styled.CompanyPresentation>
            </Styled.ResetForm>
        </Styled.ResetFormContainer>
    )
}

export default Reset;
