export interface ModalProps {
    isOpen: boolean;
    entityName: string;

    onClose: () => void;
    onConfirm: () => void;
}
