export interface TableProps<T> {
    isSystemRoot?: boolean;
    headers: string[];
    data: T[];

    getEntityId: (item: T) => number;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    renderEntityRow: (item: T) => React.ReactNode;
}
