export interface ConnectionProps {
    onPairingSuccess: boolean;
    isOpen: boolean;
    companyId: number;

    onClose: () => void;
}
