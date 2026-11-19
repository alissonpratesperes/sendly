import axios from 'axios';
import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import * as S from '../styles/reset.style';
import * as I from '../../../shared/styles/icon.style';
import * as G from '../../../shared/styles/global.style';

import { Reset as ResetPassword } from '../services/authentication.service';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';

export const Reset: React.FC = () => {
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
    }, [ passwordResetToken, navigate, ]);

    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        if (!passwordResetToken) {
            toast.error("Token de redefinição de senha inválido");

            return;
        }

        try {
            setIsLoading(true);

            await ResetPassword(passwordResetToken, { newPassword, confirmPassword });

            toast.success("Nova senha definida com sucesso");

            setIsLoading(false);

            navigate("/authentication", { replace: true });
        } catch (error: unknown) {
            if(axios.isAxiosError(error) && error.response?.status === StatusCodes.UNAUTHORIZED)  {
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
        <G.FormContainer>
            <S.ResetForm onSubmit={ handleSubmit }>
                <G.FormTitle> Atualizar senha </G.FormTitle>
                <G.FormSubtitle> Para configurar sua nova senha, utilize os dois campos abaixo </G.FormSubtitle>

                <G.InputWrapper>
                    <G.Label htmlFor="newPassword"> NOVA SENHA </G.Label>

                    <G.Input type={ showPassword ? "text" : "password" } id="newPassword" placeholder="Digite sua nova senha" value={ newPassword } onChange={ (inputEvent) => setNewPassword(inputEvent.target.value) } required/>

                    <S.EyeButton type="button" onClick={ () => setShowPassword(!showPassword) }> { showPassword ? ( <S.EyeButtonIconOpened/> ) : ( <S.EyeButtonIconClosed/> ) } </S.EyeButton>
                </G.InputWrapper>
                <G.InputWrapper>
                    <G.Label htmlFor="confirmPassword"> CONFIRMAR NOVA SENHA </G.Label>

                    <G.Input type={ showConfirmPassword ? "text" : "password" } id="confirmPassword" placeholder="Confirme sua nova senha" value={ confirmPassword } onChange={ (inputEvent) => setConfirmPassword(inputEvent.target.value) } required/>

                    <S.EyeButton type="button" onClick={ () => setShowConfirmPassword(!showConfirmPassword) }> { showConfirmPassword ? ( <S.EyeButtonIconOpened/> ) : ( <S.EyeButtonIconClosed/> ) } </S.EyeButton>
                </G.InputWrapper>

                { isLoading && (
                    <LoadingState/>
                ) }
                { !isLoading && (
                    <S.PasswordButton type="submit">
                        <I.UserLockIcon/>

                        <S.PasswordButtonText> Criar senha </S.PasswordButtonText>
                    </S.PasswordButton>
                ) }
            </S.ResetForm>
        </G.FormContainer>
    )
}
