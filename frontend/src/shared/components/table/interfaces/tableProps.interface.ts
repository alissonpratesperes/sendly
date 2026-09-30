export interface TableProps<T> {
    headers: string[];
    data: T[];
    isInBatchScreen?: boolean;

    getEntityId: (item: T) => number;
    onView?: (id: number) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    renderEntityRow: (item: T) => React.ReactNode;

    canView?: boolean | ((entity: T) => boolean);
    canEdit?: boolean | ((entity: T) => boolean);
    canDelete?: boolean | ((entity: T) => boolean);
}
