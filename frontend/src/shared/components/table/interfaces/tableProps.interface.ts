export interface TableProps<T> {
    headers: string[];
    data: T[];

    getEntityId: (item: T) => number;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    renderEntityRow: (item: T) => React.ReactNode;

    canEdit?: boolean | ((entity: T) => boolean);
    canDelete?: boolean | ((entity: T) => boolean);
}
