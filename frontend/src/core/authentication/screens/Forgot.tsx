import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Styled from '../styles/forgot.style';
import * as I from '../../../shared/styles/icon.style';
import * as G from '../../../shared/styles/global.style';

import { Forgot as ForgotPassword } from '../services/authentication.service';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';

export const Forgot: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        try {
            setIsLoading(true);

            await ForgotPassword({ email });

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
        <G.FormContainer>
            <Styled.ForgotForm onSubmit={ handleSubmit }>
                <G.FormTitle> Recuperar senha </G.FormTitle>
                <G.FormSubtitle> Para solicitar a redefinição de senha, informe seu e-mail abaixo </G.FormSubtitle>

                <G.InputWrapper>
                    <G.Label htmlFor="email"> E-MAIL </G.Label>

                    <G.Input type="email" id="email" placeholder="Digite seu email" value={ email } onChange={ (inputEvent) => setEmail(inputEvent.target.value) } required/>
                </G.InputWrapper>

                { isLoading && (
                    <LoadingState/>
                ) }
                { !isLoading && (
                    <Styled.ForgotButton type="submit">
                        <I.InboxIcon/>

                        <Styled.ForgotButtonText> Recuperar </Styled.ForgotButtonText>
                    </Styled.ForgotButton>
                ) }
            </Styled.ForgotForm>
        </G.FormContainer>
    )
}
