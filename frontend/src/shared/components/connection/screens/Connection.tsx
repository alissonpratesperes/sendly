import { toast } from 'react-toastify';
import { Ban, GlobeOff, GlobeCode, X } from 'lucide-react';
import React, { useState, useEffect, Fragment } from 'react';

import * as Styled from '../../../styles/modal.style';
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
    const [connectedPhone, setConnectedPhone] = useState<string | null>(null);
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

            toast.success("Sessão do WhatsApp encerrada com sucesso");

            setIsClosing(true);
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
                setConnectedPhone(response.phone ?? null);
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
        <Styled.ModalOverlay $open={ isOpen && !isClosing } onClick={ () => setIsClosing(true) }>
            { isOpen && (
                <Styled.ModalWrapper $open={ !isClosing } onClick={ (event) => event.stopPropagation() } onAnimationEnd={ (event) => { if (event.animationName === "modalClose") { onClose(); setIsClosing(false); } } }>
                    <Styled.ModalContainer>
                        <Styled.ModalHeader>
                            <Styled.ModalTitle> Status da sessão do WhatsApp </Styled.ModalTitle>

                            <Styled.ModalDismissButton type="button" onClick={ () => setIsClosing(true) }> <X size={ 25 } /> </Styled.ModalDismissButton>
                        </Styled.ModalHeader>

                        <Styled.ModalBody>
                            { loadingStatus ? (
                                <LoadingState />
                            ) : status?.connected ? (
                                <ConnectionBadge variant={ ConnectionBadgeVariant.CONNECTED } phone={ connectedPhone ?? undefined }/>
                            ) : (
                                <Fragment>
                                    { pairingCode ? (
                                        <ConnectionBadge variant={ ConnectionBadgeVariant.WAITING }/>
                                    ) : (
                                        <ConnectionBadge variant={ ConnectionBadgeVariant.DISCONNECTED }/>
                                    ) }

                                    <Styled.ModalInnerBodyContainer>
                                        { !pairingCode ? (
                                            <BaileysForm onCancel={ () => {} } onSubmit={ () => {} } onLoadingChange={ setLoadingStatus } onPairingSuccess={ (pairingCode) => setPairingCode(pairingCode) } />
                                        ) : (
                                            <PairingCode pairingCode={ pairingCode } />
                                        ) }
                                    </Styled.ModalInnerBodyContainer>
                                </Fragment>
                            ) }
                        </Styled.ModalBody>

                        <Styled.ModalFooter>
                            <Styled.ModalPrimaryButton onClick={ () => setIsClosing(true) }>
                                <Ban size={ 25 } />

                                <Styled.ModalFooterButtonText> Fechar </Styled.ModalFooterButtonText>
                            </Styled.ModalPrimaryButton>

                            { !status?.connected && !pairingCode && (
                                <Styled.ModalTertiaryButton type="submit" form="baileys-form" disabled={ loadingStatus }>
                                  <GlobeCode size={ 25 } />

                                  <Styled.ModalFooterButtonText> Gerar código </Styled.ModalFooterButtonText>
                                </Styled.ModalTertiaryButton>
                            ) }
                            { status?.connected && (
                                <Styled.ModalSecondaryButton onClick={ handleDisconnect }>
                                    <GlobeOff size={ 25 } />

                                    <Styled.ModalFooterButtonText> Desconectar </Styled.ModalFooterButtonText>
                                </Styled.ModalSecondaryButton>
                            ) }
                        </Styled.ModalFooter>
                    </Styled.ModalContainer>
                </Styled.ModalWrapper>
            ) }
        </Styled.ModalOverlay>
    );
}

export default Connection;
