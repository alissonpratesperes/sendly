import { AtSign } from 'lucide-react';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Styled from '../styles/forgot.style';
import { forgot } from '../services/authentication.service';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';

const Forgot: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        try {
            setIsLoading(true);

            await forgot({ email });

            toast.success("Solicitação realizada com sucesso, verifique seu e-mail");

            setIsLoading(false);

            navigate("/authentication", { replace: true });
        } catch {
            toast.error("Não é possível prosseguir com a solicitação");

            setIsLoading(false);

            return;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Styled.ForgotFormContainer>
            <Styled.BackgroundWave viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#223463" fill-opacity="1" d="M0,192L80,160C160,128,320,64,480,80C640,96,800,192,960,202.7C1120,213,1280,139,1360,101.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </Styled.BackgroundWave>

            <Styled.ForgotForm onSubmit={handleSubmit}>
                <Styled.ApplicationBrandContainer> <Styled.ApplicationBrandMark> Sendly </Styled.ApplicationBrandMark> </Styled.ApplicationBrandContainer>

                <Styled.FormTitle> Esqueci minha senha </Styled.FormTitle>
                <Styled.FormSubtitle> Para solicitar a redefinição de senha, informe seu e-mail abaixo </Styled.FormSubtitle>

                <Styled.InputWrapper>
                    <Styled.Label htmlFor="email"> E-MAIL </Styled.Label>

                    <Styled.Input type="email" id="email" placeholder="Digite seu email" value={email} onChange={(inputEvent) => setEmail(inputEvent.target.value)} required />
                </Styled.InputWrapper>

                { isLoading && (
                    <LoadingState/>
                ) }
                { !isLoading && (
                    <Styled.ForgotButton type="submit">
                        <AtSign size={ 25 } color="#FFFFFF" />

                        <Styled.ForgotButtonText> Solicitar link </Styled.ForgotButtonText>
                    </Styled.ForgotButton>
                ) }

                <Styled.CompanyPresentation>
                    <Styled.CopyrightParagraph> © 2026 Sendly | Todos os direitos reservados </Styled.CopyrightParagraph>
                </Styled.CompanyPresentation>
            </Styled.ForgotForm>
        </Styled.ForgotFormContainer>
    )
}

export default Forgot;
