export interface DrawerProps {
    isOpen: boolean;
    isSubmitting?: boolean;
    formId?: string;
    title: string;
    children: React.ReactNode;
    mode?: "create" | "edit";

    onClose: () => void;
}
