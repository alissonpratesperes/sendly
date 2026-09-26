export interface FinderProps {
    showImportButton?: boolean;
    importButtonText?: string;
    showAddButton: boolean;
    placeholder: string;
    buttonText: string;
    search: string;

    onAdd: () => void;
    onImport?: () => void;
    onSearchChange: (value: string) => void;
}
