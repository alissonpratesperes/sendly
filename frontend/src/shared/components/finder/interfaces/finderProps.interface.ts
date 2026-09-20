export interface FinderProps {
    isSystemRoot?: boolean;
    placeholder: string;
    buttonText: string;
    search: string;

    onAdd: () => void;
    onSearchChange: (value: string) => void;
}
