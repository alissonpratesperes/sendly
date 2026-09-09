import z from 'zod';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeClosedIcon, Dot, MoveLeft } from 'lucide-react';

import * as Styled from '../styles/FirstAccess.style';
import { ChangePassword } from '../services/FirstAccess.service';
import Toast from '../../../shared/components/toast/screens/Toast';
import { FirstAccessPasswordDTO } from '../dtos/FirstAccessPasswordDTO.dto';
import AuthenticationIllustration from '../../../assets/authentication_illustration.svg';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';
import { validatePasswordLengthUtil } from '../../../shared/utils/validatePasswordLengthUtil.util';
import { validatePasswordContentUtil } from '../../../shared/utils/validatePasswordContentUtil.util';

const FirstAccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [senha, setSenha] = useState<string>('');
    const [showSenha, setShowSenha] = useState(false);
    const [senhaError, setSenhaError] = useState<string>('');
    const [senhaAtual, setSenhaAtual] = useState<string>('');
    const [showSenhaAtual, setShowSenhaAtual] = useState(false);
    const isFirstAccess = location.state?.primeiroAcesso ?? false;
    const [confirmacaoSenha, setConfirmacaoSenha] = useState<string>('');
    const [showConfirmacaoSenha, setShowConfirmacaoSenha] = useState(false);
    const [confirmacaoSenhaError, setConfirmacaoSenhaError] = useState<string>('');
    const temporaryFirstAccessToken = location.state?.temporaryFirstAccessToken ?? '';

    const { showLoading, hideLoading } = useLoading();

    const togglePasswordVisibility = (field: string) => {
        if (field === 'senhaAtual') {
            setShowSenhaAtual(!showSenhaAtual);
        } else if (field === 'senha') {
            setShowSenha(!showSenha);
        } else if (field === 'confirmacaoSenha') {
            setShowConfirmacaoSenha(!showConfirmacaoSenha);
        };
    };
    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        let valid = true;

        setSenhaError('');
        setConfirmacaoSenhaError('');

        if (senha !== confirmacaoSenha) {
            setConfirmacaoSenhaError('As senhas não coincidem');

            valid = false;
        };
        if (!validatePasswordLengthUtil(senha)) {
            setSenhaError('A senha precisa ter 8 digitos');

            valid = false;
        };
        if (!validatePasswordContentUtil(senha)) {
            setSenhaError('A senha deve conter letras e números');

            valid = false;
        };
        if (!valid) {
            return;
        };

        try {
            showLoading();

            const passwordData: FirstAccessPasswordDTO = { confirmacaoSenhaNova: confirmacaoSenha, senhaAtual, senhaNova: senha };

            if (isFirstAccess) {
                await ChangePassword(passwordData, { isFirstAccess: true, temporaryFirstAccessToken });
            } else {
                await ChangePassword(passwordData);
            };

            toast.success('Nova senha definida com sucesso');

            navigate('/auth');
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error(<Toast errors={error.issues} />);
            } else {
                toast.error("Não foi possível realizar a definição de senha");
            };
        } finally {
            hideLoading();
        };
    };

    return (
        <Styled.AuthFormContainer>
            <Styled.LoginForm onSubmit={handleSubmit}>
                {!isFirstAccess && (
                    <Styled.HeaderWrapper>
                        <Styled.GoBackButton onClick={() => navigate(-1)}>
                            <MoveLeft size={20} />

                            <Styled.GoBackButtonLabel> Voltar </Styled.GoBackButtonLabel>
                        </Styled.GoBackButton>
                    </Styled.HeaderWrapper>
                )}

                <Styled.FormTitle> {isFirstAccess ? 'Criar nova senha' : 'Alterar senha'} </Styled.FormTitle>

                <Styled.InputWrapper>
                    <Styled.Label htmlFor="senhaAtual"> SENHA ATUAL </Styled.Label>

                    <Styled.Input type={showSenhaAtual ? 'text' : 'password'} id="senhaAtual" placeholder="Digite sua senha atual" value={senhaAtual} onChange={(inputEvent) => setSenhaAtual(inputEvent.target.value)} required />

                    <Styled.EyeIcon onClick={() => togglePasswordVisibility('senhaAtual')}> {showSenhaAtual ? (<EyeIcon size={20} color="#BEBEBE" />) : (<EyeClosedIcon size={20} color="#BEBEBE" />)} </Styled.EyeIcon>
                </Styled.InputWrapper>
                <Styled.InputWrapper>
                    <Styled.Label htmlFor="senha"> NOVA SENHA </Styled.Label>

                    <Styled.Input type={showSenha ? 'text' : 'password'} id="senha" placeholder="Digite sua nova senha" value={senha} onChange={(inputEvent) => setSenha(inputEvent.target.value)} required />

                    <Styled.EyeIcon onClick={() => togglePasswordVisibility('senha')}> {showSenha ? (<EyeIcon size={20} color="#BEBEBE" />) : (<EyeClosedIcon size={20} color="#BEBEBE" />)} </Styled.EyeIcon>
                </Styled.InputWrapper>
                <Styled.InputWrapper>
                    <Styled.Label htmlFor="confirmacaoSenha"> CONFIRMAR NOVA SENHA </Styled.Label>

                    <Styled.Input type={showConfirmacaoSenha ? 'text' : 'password'} id="confirmacaoSenha" placeholder="Confirme sua nova senha" value={confirmacaoSenha} onChange={(inputEvent) => setConfirmacaoSenha(inputEvent.target.value)} required />

                    <Styled.EyeIcon onClick={() => togglePasswordVisibility('confirmacaoSenha')}> {showConfirmacaoSenha ? (<EyeIcon size={20} color="#BEBEBE" />) : (<EyeClosedIcon size={20} color="#BEBEBE" />)} </Styled.EyeIcon>
                </Styled.InputWrapper>

                {senhaError && (<Styled.ErrorList><Styled.ErrorListItem> <Dot size={20} color="#A20720" /> {senhaError} </Styled.ErrorListItem></Styled.ErrorList>)}
                {confirmacaoSenhaError && (<Styled.ErrorList><Styled.ErrorListItem> <Dot size={20} color="#A20720" /> {confirmacaoSenhaError} </Styled.ErrorListItem></Styled.ErrorList>)}

                <Styled.LoginButton type="submit"> Criar nova senha </Styled.LoginButton>
            </Styled.LoginForm>

            <Styled.AuthBackgroundIllustration src={AuthenticationIllustration} />
        </Styled.AuthFormContainer>
    );
};

export default FirstAccess;