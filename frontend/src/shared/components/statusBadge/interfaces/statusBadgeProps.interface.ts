import { UserBadgeVariant } from '../enums/userBadgeVariant.enum';
import { BatchBadgeVariant } from '../enums/batchBadgeVariant.enum';
import { BatchSendBadgeVariant } from '../enums/batchSendBadgeVariant.enum';

export interface StatusBadgeProps {
    variant: UserBadgeVariant | BatchBadgeVariant | BatchSendBadgeVariant;
}
