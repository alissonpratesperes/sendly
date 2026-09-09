import React from 'react';
import { X } from 'lucide-react';

import * as Styled from '../styles/Modal.style';
import { DeleteModalProps } from '../interfaces/DeleteModalProps.interface';

const Modal: React.FC<DeleteModalProps> = ({ isOpen, entityName, onClose, onConfirm }) => {
    if (!isOpen) {
        return null
    };

    return (
        <Styled.Overlay>
            <Styled.ModalWrapper>
                <Styled.ModalContainer>
                    <Styled.ModalHeader>
                        <Styled.Title> Exclusão de registro </Styled.Title>

                        <Styled.CloseButton onClick={onClose}> <X size={20} /> </Styled.CloseButton>
                    </Styled.ModalHeader>

                    <Styled.Divider />

                    <Styled.ModalBody>
                        <Styled.Text> Tem certeza que deseja excluir <Styled.BoldText> {entityName} </Styled.BoldText> ? </Styled.Text>
                        <Styled.Text> Não será possível recuperar essa ação. </Styled.Text>
                    </Styled.ModalBody>

                    <Styled.ModalFooter>
                        <Styled.ButtonsWrapper>
                            <Styled.CancelButton onClick={onClose}> Cancelar </Styled.CancelButton>

                            <Styled.DeleteButton onClick={onConfirm}> Excluir </Styled.DeleteButton>
                        </Styled.ButtonsWrapper>
                    </Styled.ModalFooter>
                </Styled.ModalContainer>
            </Styled.ModalWrapper>
        </Styled.Overlay>
    );
};

export default Modal;