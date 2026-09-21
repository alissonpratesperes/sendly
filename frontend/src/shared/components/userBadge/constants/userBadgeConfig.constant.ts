import { UserBadgeVariant } from '../enums/userBadgeVariant.enum';
import { UserBadgeConfigItemProps } from '../interfaces/userBadgeConfigItemProps.interface';

export const USER_BADGE_CONFIG: Record<UserBadgeVariant, UserBadgeConfigItemProps> = {
    [UserBadgeVariant.FIRST_ACCESS]: {
        label: "Inativo",
        fontColor: "#DC143C",
        backgroundColor: "#FDECEF",
    },
    [UserBadgeVariant.NOT_FIRST_ACCESS]: {
        label: "Ativo",
        fontColor: "#10CF67",
        backgroundColor: "#ECFDF3",
    },
    [UserBadgeVariant.SYSTEM_ROOT]: {
        label: "Administrador",
        fontColor: "#6941C6",
        backgroundColor: "#F9F5FF",
    },
    [UserBadgeVariant.NOT_SYSTEM_ROOT]: {
        label: "Usuário",
        fontColor: "#535862",
        backgroundColor: "#F5F5F5",
    },
}
