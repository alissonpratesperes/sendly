import { ComponentType } from 'react';
import { DatabaseZapIcon, Activity, LucideProps } from 'lucide-react';

import { AppRoutes } from '../enums/appRoutes.enum';

export const HEADER_MENU_ICONS_CONFIG: Record<AppRoutes, ComponentType<LucideProps>> = {
    [AppRoutes.HOME]: Activity,
    [AppRoutes.REGISTRATIONS]: DatabaseZapIcon,
}
