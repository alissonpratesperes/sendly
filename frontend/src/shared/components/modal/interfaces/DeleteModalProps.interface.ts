export interface DeleteModalProps {
    isOpen: boolean;
    entityName: string;

    onClose: () => void;
    onConfirm: () => void;
};