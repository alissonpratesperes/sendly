import React, { useState } from 'react';
import { Ban, Trash, X } from 'lucide-react';

import * as Styled from '../styles/modal.style';
import { ModalProps } from '../interfaces/modalProps.interface';

const Modal: React.FC<ModalProps> = ({ isOpen, entityName, onClose, onConfirm }) => {
    const [isClosing, setIsClosing] = useState(false);

    return (
        <Styled.Overlay $open={ isOpen && !isClosing } onClick={ () => setIsClosing(true) }>
            { isOpen && (
                <Styled.ModalWrapper $open={ !isClosing } onClick={ (event) => event.stopPropagation() } onAnimationEnd={ (event) => { if (event.animationName === "modalClose") { onClose(); setIsClosing(false); } } }>
                <Styled.ModalContainer>
                    <Styled.ModalHeader>
                        <Styled.Title> Exclusão de registro </Styled.Title>

                        <Styled.CloseButton type="button" onClick={ () => setIsClosing(true) }> <X size={ 25 } /> </Styled.CloseButton>
                    </Styled.ModalHeader>

                    <Styled.ModalBody>
                        <Styled.Text> Tem certeza que deseja excluir <Styled.BoldText> { entityName } </Styled.BoldText> ? </Styled.Text>
                        <Styled.Text> Não será possível reverter essa ação. </Styled.Text>
                    </Styled.ModalBody>

                    <Styled.ModalFooter>
                        <Styled.CancelButton onClick={ () => setIsClosing(true) }>
                            <Ban size={ 25 } />

                            <Styled.FooterButtonText> Cancelar </Styled.FooterButtonText>
                        </Styled.CancelButton>
                        <Styled.DeleteButton onClick={ onConfirm }>
                            <Trash size={ 25 } />

                            <Styled.FooterButtonText> Excluir </Styled.FooterButtonText>
                        </Styled.DeleteButton>
                    </Styled.ModalFooter>
                </Styled.ModalContainer>
            </Styled.ModalWrapper>
            ) }
        </Styled.Overlay>
    );
}

export default Modal;
