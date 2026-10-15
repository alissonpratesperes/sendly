import { UserKey, UserCheck, UserShield, User, Flame, Rocket, ChartPie, Bomb, Trophy, RotateCwFadingClock, CheckCheck, AlertTriangle } from 'lucide-react';

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
        icon: Flame,
        iconColor: "#98A2B3",
    },
    [BatchStatus.RUNNING]: {
        icon: Rocket,
        iconColor: "#1C70E9",
    },
    [BatchStatus.PARTIAL]: {
        icon: ChartPie,
        iconColor: "#FF6B00",
    },
    [BatchStatus.FAILED]: {
        icon: Bomb,
        iconColor: "#DC143C",
    },
    [BatchStatus.FINISHED]: {
        icon: Trophy,
        iconColor: "#10CF67",
    },

    [BatchSendStatus.WAITING]: {
        icon: RotateCwFadingClock,
        iconColor: "#FF6B00",
    },
    [BatchSendStatus.PROCESSING]: {
        icon: Rocket,
        iconColor: "#1C70E9",
    },
    [BatchSendStatus.SENT]: {
        icon: CheckCheck,
        iconColor: "#10CF67",
    },
    [BatchSendStatus.ERROR]: {
        icon: AlertTriangle,
        iconColor: "#DC143C",
    },
}
