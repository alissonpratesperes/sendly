import React, { useState } from 'react';

import * as Styled from '../../../styles/modal.style';
import { ModalProps } from '../interfaces/modalProps.interface';

const Modal: React.FC<ModalProps> = ({ isOpen, entityName, onClose, onConfirm }) => {
    const [isClosing, setIsClosing] = useState(false);

    return (
        <Styled.ModalOverlay $open={ isOpen && !isClosing } onClick={ () => setIsClosing(true) }>
            { isOpen && (
                <Styled.ModalWrapper $open={ !isClosing } onClick={ (event) => event.stopPropagation() }  onAnimationEnd={ (event) => { if (event.currentTarget === event.target && isClosing) { onClose(); setIsClosing(false); } } }>
                <Styled.ModalContainer>
                    <Styled.ModalHeader>
                        <Styled.ModalTitle> Exclusão de cadastro </Styled.ModalTitle>

                        <Styled.ModalDismissButton type="button" onClick={ () => setIsClosing(true) }> <Styled.ModalDismissButtonIcon/> </Styled.ModalDismissButton>
                    </Styled.ModalHeader>

                    <Styled.ModalBody>
                        <Styled.ModalText> Tem certeza que deseja excluir <Styled.ModalBoldText> { entityName } </Styled.ModalBoldText> ? </Styled.ModalText>
                    </Styled.ModalBody>

                    <Styled.ModalFooter>
                        <Styled.ModalPrimaryButton onClick={ () => setIsClosing(true) }>
                            <Styled.ModalPrimaryButtonIcon/>

                            <Styled.ModalFooterButtonText> Cancelar </Styled.ModalFooterButtonText>
                        </Styled.ModalPrimaryButton>
                        <Styled.ModalSecondaryButton onClick={ onConfirm }>
                            <Styled.ModalSecondaryButtonTrashIcon/>

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
