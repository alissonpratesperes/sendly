import axios from 'axios';
import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';
import React, { useEffect, useState } from 'react';
import { EyeIcon, EyeOffIcon, UserLock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import * as Styled from '../styles/Reset.style';
import { reset } from '../services/authentication.service';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';

const Reset: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { showLoading, hideLoading } = useLoading();

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
            showLoading();

            await reset(passwordResetToken, { newPassword, confirmPassword });

            toast.success("Nova senha definida com sucesso");

            navigate("/authentication", { replace: true });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === StatusCodes.BAD_REQUEST) {
                toast.error("As senhas não coincidem");

                return;
            } else if(axios.isAxiosError(error) && error.response?.status === StatusCodes.UNAUTHORIZED)  {
                toast.error("Token de redefinição de senha inválido");
            } else {
                toast.error("Não é possível definir a nova senha");
            }
        } finally {
            hideLoading();
        }
    }

    return (
        <Styled.ResetFormContainer>
            <Styled.ResetForm onSubmit={handleSubmit}>
                <Styled.FormTitle> Definir uma nova senha </Styled.FormTitle>
                <Styled.FormSubtitle> Para redefinir sua senha, utilize os campos abaixo </Styled.FormSubtitle>

                <Styled.InputWrapper>
                    <Styled.Label htmlFor="newPassword"> NOVA SENHA </Styled.Label>

                    <Styled.Input type={showPassword ? "text" : "password"} id="newPassword" placeholder="Digite sua nova senha" value={newPassword} onChange={(inputEvent) => setNewPassword(inputEvent.target.value)} required />

                    <Styled.EyeButton type="button" onClick={() => setShowPassword(!showPassword)}> {showPassword ? ( <EyeIcon size={20} color="#223463" /> ) : ( <EyeOffIcon size={20} color="#223463" /> )} </Styled.EyeButton>
                </Styled.InputWrapper>
                <Styled.InputWrapper>
                    <Styled.Label htmlFor="confirmPassword"> CONFIRMAR NOVA SENHA </Styled.Label>

                    <Styled.Input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" placeholder="Confirme sua nova senha" value={confirmPassword} onChange={(inputEvent) => setConfirmPassword(inputEvent.target.value)} required />

                    <Styled.EyeButton type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}> {showConfirmPassword ? ( <EyeIcon size={20} color="#223463" /> ) : ( <EyeOffIcon size={20} color="#223463" /> )} </Styled.EyeButton>
                </Styled.InputWrapper>

                <Styled.PasswordButton type="submit"> <UserLock size={20} color="#FFFFFF" /> <Styled.PasswordButtonText> Criar senha </Styled.PasswordButtonText> </Styled.PasswordButton>
            </Styled.ResetForm>
        </Styled.ResetFormContainer>
    )
}

export default Reset;
