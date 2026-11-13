import { KeyRound, BadgeCheck, Award, CircleUserRound } from 'lucide-react';

import { UserStatus } from '../../../../core/user/enums/userStatus.enum';
import { StatusBadgeConfigItemProps } from '../interfaces/statusBadgeConfigItemProps.interface';

export const STATUS_BADGE_CONFIG: Record<UserStatus, StatusBadgeConfigItemProps> = {
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
}
