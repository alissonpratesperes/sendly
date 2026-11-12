import { UserStatus } from '../../../../core/user/enums/userStatus.enum';
import { BatchSendStatus } from '../../../../core/batch/enums/batchSendStatus.enum';

export interface StatusBadgeProps {
    variant: UserStatus | BatchSendStatus;
}
