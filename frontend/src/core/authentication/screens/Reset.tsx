import axios from 'axios';
import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';
import React, { useEffect, useState } from 'react';
import { EyeIcon, EyeOffIcon, UserLock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import * as Styled from '../styles/reset.style';
import { reset } from '../services/authentication.service';
import { Wave } from '../../../shared/elements/wave/screens/Wave';
import { Brand } from '../../../shared/elements/brand/screens/brand';
import { Copyright } from '../../../shared/elements/copyright/screens/Copyright';
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
        <Styled.ResetFormContainer>
            <Wave />

            <Styled.ResetForm onSubmit={ handleSubmit }>
                <Brand/>

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

                <Copyright/>
            </Styled.ResetForm>
        </Styled.ResetFormContainer>
    )
}

export default Reset;
