import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { MailCheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import * as Styled from '../styles/Forgot.style';
import { forgot } from '../services/authentication.service';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';

const Forgot: React.FC = () => {
    const [email, setEmail] = useState("");

    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();

    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        try {
            showLoading();

            await forgot({ email });

            toast.success("Solicitação realizada com sucesso, verifique seu e-mail");

            navigate("/authentication", { replace: true });
        } catch {
            toast.error("Não é possível prosseguir com a solicitação");
        } finally {
            hideLoading();
        }
    }

    return (
        <Styled.ForgotFormContainer>
            <Styled.ForgotForm onSubmit={handleSubmit}>
                <Styled.FormTitle> Esqueci minha senha </Styled.FormTitle>
                <Styled.FormSubtitle> Para solicitar a redefinição de senha, informe seu e-mail abaixo </Styled.FormSubtitle>

                <Styled.InputWrapper>
                    <Styled.Label htmlFor="email"> E-MAIL </Styled.Label>

                    <Styled.Input type="email" id="email" placeholder="Digite seu email" value={email} onChange={(inputEvent) => setEmail(inputEvent.target.value)} required />
                 </Styled.InputWrapper>

                <Styled.ForgotButton type="submit"> <MailCheckIcon size={20} color="#FFFFFF" /> <Styled.ForgotButtonText> Solicitar link </Styled.ForgotButtonText> </Styled.ForgotButton>
            </Styled.ForgotForm>
        </Styled.ForgotFormContainer>
    )
}

export default Forgot;
