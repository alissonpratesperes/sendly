import { Wifi, WifiCog, WifiOff, } from 'lucide-react';

import { ConnectionBadgeVariant } from '../enums/connectionBadgeVariant.enum';
import { ConnectionBadgeConfigItemProps } from '../interfaces/connectionBadgeConfigItemProps.interface';

export const CONNECTION_BADGE_CONFIG: Record<ConnectionBadgeVariant, ConnectionBadgeConfigItemProps> = {
    [ConnectionBadgeVariant.CONNECTED]: {
        label: "Conectado",
        fontColor: "#10CF67",
        backgroundColor: "#ECFDF3",
        icon: Wifi,
    },
    [ConnectionBadgeVariant.WAITING]: {
        label: "Aguardando conexão",
        fontColor: "#B54708",
        backgroundColor: "#FFFAEB",
        icon: WifiCog,
    },
    [ConnectionBadgeVariant.DISCONNECTED]: {
        label: "Desconectado",
        fontColor: "#DC143C",
        backgroundColor: "#FDECEF",
        icon: WifiOff,
    },
}
