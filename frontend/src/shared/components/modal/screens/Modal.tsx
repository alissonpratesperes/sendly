import React, { useState } from 'react';

import * as G from '../../../styles/global.style';
import * as Styled from '../../../styles/modal.style';
import * as I from '../../../../shared/styles/icon.style';

import { ModalProps } from '../interfaces/modalProps.interface';

export const Modal: React.FC<ModalProps> = ({ isOpen, entityName, onClose, onConfirm }) => {
    const [isClosing, setIsClosing] = useState(false);

    return (
        <Styled.ModalOverlay $open={ isOpen && !isClosing }>
            { isOpen && (
                <Styled.ModalWrapper $open={ !isClosing } onClick={ (event) => event.stopPropagation() }  onAnimationEnd={ (event) => { if (event.currentTarget === event.target && isClosing) { onClose(); setIsClosing(false); } } }>
                    <Styled.ModalContainer>
                        <Styled.ModalHeader>
                            <Styled.ModalTitle> Exclusão de cadastro </Styled.ModalTitle>

                            <Styled.ModalDismissButton type="button" onClick={ () => setIsClosing(true) }> <I.XIcon/> </Styled.ModalDismissButton>
                        </Styled.ModalHeader>

                        <Styled.ModalBody>
                            <Styled.ModalText> Tem certeza que deseja excluir <Styled.ModalBoldText> { entityName } </Styled.ModalBoldText> ? </Styled.ModalText>
                        </Styled.ModalBody>

                        <Styled.ModalFooter>
                            <G.ButtonsContainer>
                                <Styled.ModalPrimaryButton onClick={ () => setIsClosing(true) }>
                                    <I.BanIcon/>

                                    <Styled.ModalFooterButtonText> Cancelar </Styled.ModalFooterButtonText>
                                </Styled.ModalPrimaryButton>
                                <Styled.ModalSecondaryButton onClick={ onConfirm }>
                                    <I.TrashIcon/>

                                    <Styled.ModalFooterButtonText> Excluir </Styled.ModalFooterButtonText>
                                </Styled.ModalSecondaryButton>
                            </G.ButtonsContainer>
                        </Styled.ModalFooter>
                    </Styled.ModalContainer>
                </Styled.ModalWrapper>
            ) }
        </Styled.ModalOverlay>
    );
}
