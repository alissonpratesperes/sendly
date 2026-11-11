import { KeyRound, BadgeCheck, Award, CircleUserRound, Flame, Rocket, ChartPie, Bomb, Trophy, RotateCwFadingClock, CircleCheck, CircleX } from 'lucide-react';

import { UserStatus } from '../../../../core/user/enums/userStatus.enum';
import { BatchStatus } from '../../../../core/batch/enums/batchStatus.enum';
import { BatchSendStatus } from '../../../../core/batch/enums/batchSendStatus.enum';
import { StatusBadgeConfigItemProps } from '../interfaces/statusBadgeConfigItemProps.interface';

export const STATUS_BADGE_CONFIG: Record<UserStatus | BatchStatus | BatchSendStatus, StatusBadgeConfigItemProps> = {
    [UserStatus.FIRST_ACCESS]: {
        icon: KeyRound,
        iconColor: "#FF6B00",
    },
    [UserStatus.NOT_FIRST_ACCESS]: {
        icon: BadgeCheck,
        iconColor: "#1C70E9",
    },
    [UserStatus.SYSTEM_ROOT]: {
        icon: Award,
        iconColor: "#223463",
    },
    [UserStatus.NOT_SYSTEM_ROOT]: {
        icon: CircleUserRound,
        iconColor: "#223463",
    },

    [BatchStatus.PENDING]: {
        icon: Flame,
        iconColor: "#98A2B3",
    },
    [BatchStatus.RUNNING]: {
        icon: Rocket,
        iconColor: "#223463",
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
        iconColor: "#223463",
    },
    [BatchSendStatus.SENT]: {
        icon: CircleCheck,
        iconColor: "#10CF67",
    },
    [BatchSendStatus.ERROR]: {
        icon: CircleX,
        iconColor: "#DC143C",
    },
}
