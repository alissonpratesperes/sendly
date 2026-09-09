export interface GenericDrawerProps {
    children: React.ReactNode;
    isOpen: boolean;
    title: string;

    onClose: () => void;
};