import React, { useState } from 'react';

import * as S from '../../../styles/modal.style';
import * as G from '../../../styles/global.style';
import * as I from '../../../../shared/styles/icon.style';

import { ModalProps } from '../interfaces/modalProps.interface';

export const Modal: React.FC<ModalProps> = ({ isOpen, entityName, onClose, onConfirm }) => {
    const [isClosing, setIsClosing] = useState(false);

    return (
        <S.ModalOverlay $open={ isOpen && !isClosing }>
            { isOpen && (
                <S.ModalWrapper $open={ !isClosing } onClick={ (event) => event.stopPropagation() }  onAnimationEnd={ (event) => { if (event.currentTarget === event.target && isClosing) { onClose(); setIsClosing(false); } } }>
                    <S.ModalContainer>
                        <S.ModalHeader>
                            <S.ModalTitle> Exclusão de cadastro </S.ModalTitle>

                            <S.ModalDismissButton type="button" onClick={ () => setIsClosing(true) }> <I.XIcon/> </S.ModalDismissButton>
                        </S.ModalHeader>

                        <S.ModalBody>
                            <S.ModalText> Tem certeza que deseja excluir <S.ModalBoldText> { entityName } </S.ModalBoldText> ? </S.ModalText>
                        </S.ModalBody>

                        <S.ModalFooter>
                            <G.ButtonsContainer>
                                <S.ModalPrimaryButton onClick={ () => setIsClosing(true) }>
                                    <I.BanIcon/>

                                    <S.ModalFooterButtonText> Cancelar </S.ModalFooterButtonText>
                                </S.ModalPrimaryButton>
                                <S.ModalSecondaryButton onClick={ onConfirm }>
                                    <I.TrashIcon/>

                                    <S.ModalFooterButtonText> Excluir </S.ModalFooterButtonText>
                                </S.ModalSecondaryButton>
                            </G.ButtonsContainer>
                        </S.ModalFooter>
                    </S.ModalContainer>
                </S.ModalWrapper>
            ) }
        </S.ModalOverlay>
    );
}
