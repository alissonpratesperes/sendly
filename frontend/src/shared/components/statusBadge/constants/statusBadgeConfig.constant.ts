import { UserStatus } from '../../../../core/user/enums/userStatus.enum';
import { BatchStatus } from '../../../../core/batch/enums/batchStatus.enum';
import { BatchSendStatus } from '../../../../core/batch/enums/batchSendStatus.enum';
import { StatusBadgeConfigItemProps } from '../interfaces/statusBadgeConfigItemProps.interface';

export const STATUS_BADGE_CONFIG: Record<UserStatus | BatchStatus | BatchSendStatus, StatusBadgeConfigItemProps> = {
    [UserStatus.FIRST_ACCESS]: {
        label: "INATIVO",
        fontColor: "#DC143C",
        backgroundColor: "#FDECEF",
    },
    [UserStatus.NOT_FIRST_ACCESS]: {
        label: "ATIVO",
        fontColor: "#10CF67",
        backgroundColor: "#ECFDF3",
    },
    [UserStatus.SYSTEM_ROOT]: {
        label: "ADMINISTRADOR",
        fontColor: "#6941C6",
        backgroundColor: "#F9F5FF",
    },
    [UserStatus.NOT_SYSTEM_ROOT]: {
        label: "USUÁRIO",
        fontColor: "#1C70E9",
        backgroundColor: "#EAF2FF",
    },

    [BatchStatus.PENDING]: {
        label: "PENDENTE",
        fontColor: "#6941C6",
        backgroundColor: "#F9F5FF",
    },
    [BatchStatus.RUNNING]: {
        label: "EXECUTANDO",
        fontColor: "#1C70E9",
        backgroundColor: "#EAF2FF",
    },
    [BatchStatus.PARTIAL]: {
        label: "PARCIAL",
        fontColor: "#FF6B00",
        backgroundColor: "#FFF4E8",
    },
    [BatchStatus.FAILED]: {
        label: "FALHA",
        fontColor: "#DC143C",
        backgroundColor: "#FDECEF",
    },
    [BatchStatus.FINISHED]: {
        label: "PROCESSADO",
        fontColor: "#10CF67",
        backgroundColor: "#ECFDF3",
    },

    [BatchSendStatus.WAITING]: {
        label: "AGUARDANDO",
        fontColor: "#FF6B00",
        backgroundColor: "#FFF4E8",
    },
    [BatchSendStatus.PROCESSING]: {
        label: "PROCESSANDO",
        fontColor: "#1C70E9",
        backgroundColor: "#EAF2FF",
    },
    [BatchSendStatus.SENT]: {
        label: "ENVIADO",
        fontColor: "#10CF67",
        backgroundColor: "#ECFDF3",
    },
    [BatchSendStatus.ERROR]: {
        label: "FALHA",
        fontColor: "#DC143C",
        backgroundColor: "#FDECEF",
    },
}
