export interface TableProps<T> {
    headers: string[];
    data: T[];

    renderRow: (item: T) => React.ReactNode;

    getId: (item: T) => number;

    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}
