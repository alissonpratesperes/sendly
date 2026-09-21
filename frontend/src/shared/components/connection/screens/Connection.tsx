import { toast } from 'react-toastify';
import React, { useState, useEffect, Fragment } from 'react';
import { Ban, GlobeOff, KeyRound, Wifi, WifiCog, WifiOff, WifiSync, X } from 'lucide-react';

import * as Styled from '../styles/connection.style';
import { LoadingState } from '../../loadingState/screens/LoadingState';
import { ConnectionProps } from '../interfaces/connectionProps.interface';
import { BaileysForm } from '../../../../core/baileys/forms/baileysForm.form';
import { Status, Logout } from '../../../../core/baileys/services/baileys.service';
import { getAuthenticationStorage } from '../../../utils/authenticationStorage.util';
import { BaileysStatusResponseDto } from '../../../../core/baileys/dtos/baileysStatusResponse.dto';

const Connection: React.FC<ConnectionProps> = ({ onPairingSuccess, isOpen, companyId, entityName, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [pairingCode, setPairingCode] = useState<string | null>(null);
    const [status, setStatus] = useState<BaileysStatusResponseDto | null>(null);

    const { userInformation } = getAuthenticationStorage();
    const targetCompanyId = companyId ?? userInformation?.company?.id;

    const handleDisconnect = async () => {
        if (!targetCompanyId) {
            toast.error("Empresa não encontrada para logout");

            return;
        }

        setLoadingStatus(true);

        try {
            await Logout({ id: targetCompanyId });

            setStatus({ connected: false });
            setPairingCode(null);
            setIsClosing(true);

            toast.success("Sessão do WhatsApp encerrada com sucesso");
        } catch (error) {
            toast.error("Erro ao desconectar sessão do WhatsApp");
        } finally {
            setLoadingStatus(false);
        }
    }

    useEffect(() => {
        if (!isOpen) {
            setPairingCode(null);

            return;
        }
        if (!targetCompanyId) {
            toast.error("Empresa não encontrada");

            setStatus({ connected: false });

            return;
        }

        const fetchStatus = async () => {
            setLoadingStatus(true);

            try {
                const response = await Status({ id: targetCompanyId });

                setStatus(response);
            } catch (error) {
                toast.error("Erro ao carregar status da sessão do WhatsApp");

                setStatus({ connected: false });
            } finally {
                setLoadingStatus(false);
            }
        }

        fetchStatus();
    }, [ isOpen, targetCompanyId ]);

    return (
        <Styled.Overlay $open={ isOpen && !isClosing } onClick={ () => setIsClosing(true) }>
            { isOpen && (
                <Styled.ModalWrapper $open={ !isClosing } onClick={ (event) => event.stopPropagation() } onAnimationEnd={ (event) => { if (event.animationName === "modalClose") { onClose(); setIsClosing(false); } } }>
                    <Styled.ModalContainer>
                        <Styled.ModalHeader>
                            <Styled.Title> Status da sessão do WhatsApp </Styled.Title>

                            <Styled.CloseButton type="button" onClick={ () => setIsClosing(true) }>
                                <X size={ 25 } />
                            </Styled.CloseButton>
                        </Styled.ModalHeader>

                        <Styled.ModalBody>
                            { loadingStatus ? (
                                <LoadingState />
                            ) : status?.connected ? (
                                <Styled.ConnectionStatusContainer>
                                    <Styled.ConnectionBadgeContainer variant="connected">
                                        <Wifi color="#10CF67" size={ 25 } />

                                        Conectado
                                    </Styled.ConnectionBadgeContainer>
                                </Styled.ConnectionStatusContainer>
                            ) : (
                                <Styled.PairingCodeContainer>
                                    <Styled.ConnectionStatusContainer>
                                        { pairingCode ? (
                                            <Styled.ConnectionBadgeContainer variant="waiting">
                                                <WifiCog className="animate-spin" color="#B54708" size={ 25 } />

                                                Aguardando conexão
                                            </Styled.ConnectionBadgeContainer>
                                        ) : (
                                            <Styled.ConnectionBadgeContainer variant="disconnected">
                                                <WifiOff color="#DC143C" size={ 25 } />

                                                Desconectado
                                            </Styled.ConnectionBadgeContainer>
                                        ) }
                                    </Styled.ConnectionStatusContainer>

                                    { !pairingCode ? (
                                        <BaileysForm
                                            onCancel={ () => {} }
                                            onSubmit={ () => {} }
                                            onLoadingChange={ setLoadingStatus }
                                            onPairingSuccess={ (code) => setPairingCode(code) }
                                        />
                                    ) : (
                                        <Fragment>
                                            <Styled.PairingTextContainer>
                                                <KeyRound size={ 25 } color="#2F2E33" />

                                                <Styled.BoldText> Insira o código abaixo no seu aplicativo do WhatsApp </Styled.BoldText>
                                            </Styled.PairingTextContainer>

                                            <Styled.PairingDigitsContainer>
                                                { pairingCode.replace(/[^a-zA-Z0-9]/g, "").split('').map((char, index) => (
                                                    <Fragment key={ index }>
                                                        <Styled.CodeChar> { char } </Styled.CodeChar>

                                                        { index === 3 && (<Styled.CodeSeparator> - </Styled.CodeSeparator>) }
                                                    </Fragment>
                                                )) }
                                            </Styled.PairingDigitsContainer>
                                        </Fragment>
                                    ) }
                                </Styled.PairingCodeContainer>
                            ) }
                        </Styled.ModalBody>

                        <Styled.ModalFooter>
                            <Styled.CancelButton onClick={ () => setIsClosing(true) }>
                                <Ban size={ 25 } />

                                <Styled.FooterButtonText> Fechar </Styled.FooterButtonText>
                            </Styled.CancelButton>

                            { !status?.connected && !pairingCode && (
                                <Styled.CodeGenerationButton type="submit" form="baileys-form" disabled={ loadingStatus }>
                                  <WifiSync size={ 25 } />

                                  <Styled.FooterButtonText> Gerar código </Styled.FooterButtonText>
                                </Styled.CodeGenerationButton>
                            ) }
                            { status?.connected && (
                                <Styled.FinishSessionButton onClick={ handleDisconnect }>
                                    <GlobeOff size={ 25 } />

                                    <Styled.FooterButtonText> Desconectar </Styled.FooterButtonText>
                                </Styled.FinishSessionButton>
                            ) }
                        </Styled.ModalFooter>
                    </Styled.ModalContainer>
                </Styled.ModalWrapper>
            ) }
        </Styled.Overlay>
    );
}

export default Connection;
