import { UserStatus } from '../../../../core/user/enums/userStatus.enum';
import { BatchStatus } from '../../../../core/batch/enums/batchStatus.enum';
import { BatchSendStatus } from '../../../../core/batch/enums/batchSendStatus.enum';

export interface StatusBadgeProps {
    variant: UserStatus | BatchStatus | BatchSendStatus;
}
