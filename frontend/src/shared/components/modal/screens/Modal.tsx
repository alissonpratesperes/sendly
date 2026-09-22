import React, { useState } from 'react';
import { Ban, Trash, X } from 'lucide-react';

import * as Styled from '../../../styles/modal.style';
import { ModalProps } from '../interfaces/modalProps.interface';

const Modal: React.FC<ModalProps> = ({ isOpen, entityName, onClose, onConfirm }) => {
    const [isClosing, setIsClosing] = useState(false);

    return (
        <Styled.ModalOverlay $open={ isOpen && !isClosing } onClick={ () => setIsClosing(true) }>
            { isOpen && (
                <Styled.ModalWrapper $open={ !isClosing } onClick={ (event) => event.stopPropagation() } onAnimationEnd={ (event) => { if (event.animationName === "modalClose") { onClose(); setIsClosing(false); } } }>
                <Styled.ModalContainer>
                    <Styled.ModalHeader>
                        <Styled.ModalTitle> Exclusão de registro </Styled.ModalTitle>

                        <Styled.ModalDismissButton type="button" onClick={ () => setIsClosing(true) }> <X size={ 25 } /> </Styled.ModalDismissButton>
                    </Styled.ModalHeader>

                    <Styled.ModalBody>
                        <Styled.ModalText> Tem certeza que deseja excluir <Styled.ModalBoldText> { entityName } </Styled.ModalBoldText> ? </Styled.ModalText>
                    </Styled.ModalBody>

                    <Styled.ModalFooter>
                        <Styled.ModalPrimaryButton onClick={ () => setIsClosing(true) }>
                            <Ban size={ 25 } />

                            <Styled.ModalFooterButtonText> Cancelar </Styled.ModalFooterButtonText>
                        </Styled.ModalPrimaryButton>
                        <Styled.ModalSecondaryButton onClick={ onConfirm }>
                            <Trash size={ 25 } />

                            <Styled.ModalFooterButtonText> Excluir </Styled.ModalFooterButtonText>
                        </Styled.ModalSecondaryButton>
                    </Styled.ModalFooter>
                </Styled.ModalContainer>
            </Styled.ModalWrapper>
            ) }
        </Styled.ModalOverlay>
    );
}

export default Modal;
