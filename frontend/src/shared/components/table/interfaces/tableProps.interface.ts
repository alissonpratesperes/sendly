export interface TableProps<T> {
    headers: string[];
    data: T[];

    getEntityId: (item: T) => number;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    renderEntityRow: (item: T) => React.ReactNode;
}
