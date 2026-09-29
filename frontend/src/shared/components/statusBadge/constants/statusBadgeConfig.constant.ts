import { UserStatus } from '../../../../core/user/enums/userStatus.enum';
import { BatchStatus } from '../../../../core/batch/enums/batchStatus.enum';
import { BatchSendStatus } from '../../../../core/batch/enums/batchSendStatus.enum';
import { StatusBadgeConfigItemProps } from '../interfaces/statusBadgeConfigItemProps.interface';

export const STATUS_BADGE_CONFIG: Record<UserStatus | BatchStatus | BatchSendStatus, StatusBadgeConfigItemProps> = {
    [UserStatus.FIRST_ACCESS]: {
        label: "Inativo",
        fontColor: "#DC143C",
    },
    [UserStatus.NOT_FIRST_ACCESS]: {
        label: "Ativo",
        fontColor: "#10CF67",
    },
    [UserStatus.SYSTEM_ROOT]: {
        label: "Administrador",
        fontColor: "#6941C6",
    },
    [UserStatus.NOT_SYSTEM_ROOT]: {
        label: "Usuário",
        fontColor: "#1C70E9",
    },

    [BatchStatus.PENDING]: {
        label: "Pendente",
        fontColor: "#6941C6",
    },
    [BatchStatus.RUNNING]: {
        label: "Executando",
        fontColor: "#1C70E9",
    },
    [BatchStatus.PARTIAL]: {
        label: "Parcial",
        fontColor: "#FF6B00",
    },
    [BatchStatus.FAILED]: {
        label: "Falha",
        fontColor: "#DC143C",
    },
    [BatchStatus.FINISHED]: {
        label: "Finalizado",
        fontColor: "#10CF67",
    },

    [BatchSendStatus.WAITING]: {
        label: "Aguardando",
        fontColor: "#FF6B00",
    },
    [BatchSendStatus.PROCESSING]: {
        label: "Processando",
        fontColor: "#1C70E9",
    },
    [BatchSendStatus.SENT]: {
        label: "Enviado",
        fontColor: "#10CF67",
    },
    [BatchSendStatus.ERROR]: {
        label: "Erro",
        fontColor: "#DC143C",
    },
}
