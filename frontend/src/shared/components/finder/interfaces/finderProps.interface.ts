export interface FinderProps {
    placeholder: string;
    buttonText: string;
    search: string;

    onAdd: () => void;
    onSearchChange: (value: string) => void;
}
