import { UserBadgeVariant } from '../enums/userBadgeVariant.enum';
import { BatchBadgeVariant } from '../enums/batchBadgeVariant.enum';
import { BatchSendBadgeVariant } from '../enums/batchSendBadgeVariant.enum';
import { StatusBadgeConfigItemProps } from '../interfaces/statusBadgeConfigItemProps.interface';

export const STATUS_BADGE_CONFIG: Record<UserBadgeVariant | BatchBadgeVariant | BatchSendBadgeVariant, StatusBadgeConfigItemProps> = {
    [UserBadgeVariant.FIRST_ACCESS]: {
        label: "INATIVO",
        fontColor: "#DC143C",
        backgroundColor: "#FDECEF",
    },
    [UserBadgeVariant.NOT_FIRST_ACCESS]: {
        label: "ATIVO",
        fontColor: "#10CF67",
        backgroundColor: "#ECFDF3",
    },
    [UserBadgeVariant.SYSTEM_ROOT]: {
        label: "ADMINISTRADOR",
        fontColor: "#6941C6",
        backgroundColor: "#F9F5FF",
    },
    [UserBadgeVariant.NOT_SYSTEM_ROOT]: {
        label: "USUÁRIO",
        fontColor: "#1C70E9",
        backgroundColor: "#EAF2FF",
    },

    [BatchBadgeVariant.PENDING]: {
        label: "PENDENTE",
        fontColor: "#6941C6",
        backgroundColor: "#F9F5FF",
    },
    [BatchBadgeVariant.RUNNING]: {
        label: "EXECUTANDO",
        fontColor: "#1C70E9",
        backgroundColor: "#EAF2FF",
    },
    [BatchBadgeVariant.PARTIAL]: {
        label: "PARCIAL",
        fontColor: "#FF6B00",
        backgroundColor: "#FFF4E8",
    },
    [BatchBadgeVariant.FAILED]: {
        label: "FALHA",
        fontColor: "#DC143C",
        backgroundColor: "#FDECEF",
    },
    [BatchBadgeVariant.FINISHED]: {
        label: "PROCESSADO",
        fontColor: "#10CF67",
        backgroundColor: "#ECFDF3",
    },

    [BatchSendBadgeVariant.WAITING]: {
        label: "AGUARDANDO",
        fontColor: "#FF6B00",
        backgroundColor: "#FFF4E8",
    },
    [BatchSendBadgeVariant.PROCESSING]: {
        label: "PROCESSANDO",
        fontColor: "#1C70E9",
        backgroundColor: "#EAF2FF",
    },
    [BatchSendBadgeVariant.SENT]: {
        label: "ENVIADO",
        fontColor: "#10CF67",
        backgroundColor: "#ECFDF3",
    },
    [BatchSendBadgeVariant.ERROR]: {
        label: "FALHA",
        fontColor: "#DC143C",
        backgroundColor: "#FDECEF",
    },
}
