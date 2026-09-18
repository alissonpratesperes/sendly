import { AtSign } from 'lucide-react';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Styled from '../styles/forgot.style';
import { forgot } from '../services/authentication.service';
import { Wave } from '../../../shared/elements/wave/screens/Wave';
import { Brand } from '../../../shared/elements/brand/screens/brand';
import { Copyright } from '../../../shared/elements/copyright/screens/Copyright';
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
            <Wave/>

            <Styled.ForgotForm onSubmit={ handleSubmit }>
                <Brand/>

                <Styled.FormTitle> Esqueci minha senha </Styled.FormTitle>
                <Styled.FormSubtitle> Para solicitar a redefinição de senha, informe seu e-mail abaixo </Styled.FormSubtitle>

                <Styled.InputWrapper>
                    <Styled.Label htmlFor="email"> E-MAIL </Styled.Label>

                    <Styled.Input type="email" id="email" placeholder="Digite seu email" value={ email } onChange={ (inputEvent) => setEmail(inputEvent.target.value) } required />
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

                <Copyright/>
            </Styled.ForgotForm>
        </Styled.ForgotFormContainer>
    )
}

export default Forgot;
