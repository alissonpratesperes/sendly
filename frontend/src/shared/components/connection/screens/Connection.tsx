import { toast } from 'react-toastify';
import React, { useState, useEffect, Fragment } from 'react';
import { Ban, GlobeOff, KeyRound, WifiSync, X } from 'lucide-react';

import * as Styled from '../styles/connection.style';
import PairingCode from '../../pairingCode/screens/PairingCode';
import { LoadingState } from '../../loadingState/screens/LoadingState';
import { ConnectionProps } from '../interfaces/connectionProps.interface';
import ConnectionBadge from '../../connectionBadge/screens/ConnectionBadge';
import { BaileysForm } from '../../../../core/baileys/forms/baileysForm.form';
import { Status, Logout } from '../../../../core/baileys/services/baileys.service';
import { ConnectionBadgeVariant } from '../../connectionBadge/enums/connectionBadgeVariant.enum';
import { BaileysStatusResponseDto } from '../../../../core/baileys/dtos/baileysStatusResponse.dto';

const Connection: React.FC<ConnectionProps> = ({ onPairingSuccess, isOpen, companyId, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [pairingCode, setPairingCode] = useState<string | null>(null);
    const [status, setStatus] = useState<BaileysStatusResponseDto | null>(null);

    const handleDisconnect = async () => {
        if (!companyId) {
            toast.error("Empresa não encontrada para logout");

            return;
        }

        setLoadingStatus(true);

        try {
            await Logout({ id: companyId });

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
        if (!companyId) {
            toast.error("Empresa não encontrada");

            setStatus({ connected: false });

            return;
        }

        const fetchStatus = async () => {
            setLoadingStatus(true);

            try {
                const response = await Status({ id: companyId });

                setStatus(response);
            } catch (error) {
                toast.error("Erro ao carregar status da sessão do WhatsApp");

                setStatus({ connected: false });
            } finally {
                setLoadingStatus(false);
            }
        }

        fetchStatus();
    }, [ isOpen, companyId ]);

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
                                <ConnectionBadge variant={ ConnectionBadgeVariant.CONNECTED }/>
                            ) : (
                                <Styled.PairingCodeContainer>
                                    { pairingCode ? (
                                        <ConnectionBadge variant={ ConnectionBadgeVariant.WAITING }/>
                                    ) : (
                                        <ConnectionBadge variant={ ConnectionBadgeVariant.DISCONNECTED }/>
                                    ) }
                                    { !pairingCode ? (
                                        <BaileysForm onCancel={ () => {} } onSubmit={ () => {} } onLoadingChange={ setLoadingStatus } onPairingSuccess={ (pairingCode) => setPairingCode(pairingCode) } />
                                    ) : (
                                        <PairingCode pairingCode={ pairingCode } />
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
