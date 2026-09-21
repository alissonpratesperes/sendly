export interface ConnectionProps {
    onPairingSuccess: boolean;
    isOpen: boolean;
    companyId: number;
    entityName: string;

    onClose: () => void;
}
