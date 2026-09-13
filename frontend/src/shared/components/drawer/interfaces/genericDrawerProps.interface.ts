export interface GenericDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;

    mode?: "create" | "edit";
    formId?: string;
}
