import { toast } from 'react-toastify';
import React, { useState, useEffect, Fragment } from 'react';

import * as I from '../../../styles/icon.style';
import * as S from '../../../styles/modal.style';
import * as G from '../../../styles/global.style';

import { PairingCode } from '../../pairingCode/screens/PairingCode';
import { LoadingState } from '../../loadingState/screens/LoadingState';
import { ConnectionProps } from '../interfaces/connectionProps.interface';
import { BaileysForm } from '../../../../core/baileys/forms/baileysForm.form';
import { ConnectionBadge } from '../../connectionBadge/screens/ConnectionBadge';
import { Status, Logout } from '../../../../core/baileys/services/baileys.service';
import { ConnectionBadgeVariant } from '../../connectionBadge/enums/connectionBadgeVariant.enum';
import { BaileysStatusResponseDto } from '../../../../core/baileys/dtos/baileysStatusResponse.dto';

export const Connection: React.FC<ConnectionProps> = ({ onPairingSuccess, isOpen, companyId, onClose }) => {
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
    }, [ isOpen, companyId, ]);

    return (
        <S.ModalOverlay $open={ isOpen && !isClosing }>
            { isOpen && (
                <S.ModalWrapper $open={ !isClosing } onClick={ (event) => event.stopPropagation() }  onAnimationEnd={ (event) => { if (event.currentTarget === event.target && isClosing) { onClose(); setIsClosing(false); } } }>
                    <S.ModalContainer>
                        <S.ModalHeader>
                            <S.ModalTitle> Sessão do WhatsApp </S.ModalTitle>

                            <S.ModalDismissButton type="button" onClick={ () => setIsClosing(true) }> <I.XIcon/> </S.ModalDismissButton>
                        </S.ModalHeader>

                        <S.ModalBody>
                            { loadingStatus ? (
                                <LoadingState/>
                            ) : status?.connected ? (
                                <ConnectionBadge variant={ ConnectionBadgeVariant.CONNECTED } phone={ connectedPhone ?? undefined }/>
                            ) : (
                                <Fragment>
                                    { pairingCode ? (
                                        <ConnectionBadge variant={ ConnectionBadgeVariant.WAITING }/>
                                    ) : (
                                        <ConnectionBadge variant={ ConnectionBadgeVariant.DISCONNECTED }/>
                                    ) }

                                    <S.ModalInnerBodyContainer>
                                        { !pairingCode ? (
                                            <BaileysForm onCancel={ () => {} } onSubmit={ () => {} } onLoadingChange={ setLoadingStatus } onPairingSuccess={ (pairingCode) => setPairingCode(pairingCode) }/>
                                        ) : (
                                            <PairingCode pairingCode={ pairingCode }/>
                                        ) }
                                    </S.ModalInnerBodyContainer>
                                </Fragment>
                            ) }
                        </S.ModalBody>

                        <S.ModalFooter>
                            <G.ButtonsContainer>
                                <S.ModalPrimaryButton onClick={ () => setIsClosing(true) }>
                                    <I.BanIcon/>

                                    <S.ModalFooterButtonText> Fechar </S.ModalFooterButtonText>
                                </S.ModalPrimaryButton>

                                { !status?.connected && !pairingCode && (
                                    <S.ModalTertiaryButton type="submit" form="baileys-form" disabled={ loadingStatus }>
                                        <I.GlobeCodeIcon/>

                                        <S.ModalFooterButtonText> Gerar código </S.ModalFooterButtonText>
                                    </S.ModalTertiaryButton>
                                ) }
                                { status?.connected && (
                                    <S.ModalSecondaryButton onClick={ handleDisconnect }>
                                        <I.GlobeOffIcon/>

                                        <S.ModalFooterButtonText> Desconectar </S.ModalFooterButtonText>
                                    </S.ModalSecondaryButton>
                                ) }
                            </G.ButtonsContainer>
                        </S.ModalFooter>
                    </S.ModalContainer>
                </S.ModalWrapper>
            ) }
        </S.ModalOverlay>
    );
}
