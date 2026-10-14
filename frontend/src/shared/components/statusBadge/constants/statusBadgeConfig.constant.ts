import { ShieldCheck     ,     User, UserCheck, UserKey, UserShield } from 'lucide-react';

import { UserStatus } from '../../../../core/user/enums/userStatus.enum';
import { BatchStatus } from '../../../../core/batch/enums/batchStatus.enum';
import { BatchSendStatus } from '../../../../core/batch/enums/batchSendStatus.enum';
import { StatusBadgeConfigItemProps } from '../interfaces/statusBadgeConfigItemProps.interface';

export const STATUS_BADGE_CONFIG: Record<UserStatus | BatchStatus | BatchSendStatus, StatusBadgeConfigItemProps> = {
    [UserStatus.FIRST_ACCESS]: {
        icon: UserKey,
        iconColor: "#FF6B00",
    },
    [UserStatus.NOT_FIRST_ACCESS]: {
        icon: UserCheck,
        iconColor: "#10CF67",
    },
    [UserStatus.SYSTEM_ROOT]: {
        icon: UserShield,
        iconColor: "#6941C6",
    },
    [UserStatus.NOT_SYSTEM_ROOT]: {
        icon: User,
        iconColor: "#1C70E9",
    },

    [BatchStatus.PENDING]: {
        icon: ShieldCheck,
        iconColor: "#6941C6",
    },
    [BatchStatus.RUNNING]: {
        icon: ShieldCheck,
        iconColor: "#1C70E9",
    },
    [BatchStatus.PARTIAL]: {
        icon: ShieldCheck,
        iconColor: "#FF6B00",
    },
    [BatchStatus.FAILED]: {
        icon: ShieldCheck,
        iconColor: "#DC143C",
    },
    [BatchStatus.FINISHED]: {
        icon: ShieldCheck,
        iconColor: "#10CF67",
    },

    [BatchSendStatus.WAITING]: {
        icon: ShieldCheck,
        iconColor: "#FF6B00",
    },
    [BatchSendStatus.PROCESSING]: {
        icon: ShieldCheck,
        iconColor: "#1C70E9",
    },
    [BatchSendStatus.SENT]: {
        icon: ShieldCheck,
        iconColor: "#10CF67",
    },
    [BatchSendStatus.ERROR]: {
        icon: ShieldCheck,
        iconColor: "#DC143C",
    },
}
