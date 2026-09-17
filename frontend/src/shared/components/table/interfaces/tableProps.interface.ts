export interface TableProps<T> {
    headers: string[];
    data: T[];

    renderEntityRow: (item: T) => React.ReactNode;
    getEntityId: (item: T) => number;

    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}
