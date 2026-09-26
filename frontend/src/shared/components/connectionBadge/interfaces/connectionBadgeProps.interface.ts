import { ConnectionBadgeVariant } from '../enums/connectionBadgeVariant.enum';

export interface ConnectionBadgeProps {
    variant: ConnectionBadgeVariant;
    phone?: string;
}
