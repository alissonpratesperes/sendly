import { DashboardGraphicDataProps } from './dashboardGraphicDataProps.interface';
import { DashboardGraphicConfigProps } from './dashboardGraphicConfigProps.interface';

export interface DashboardGraphicInfoProps {
    counterData: number;
    graphicData: DashboardGraphicDataProps[];
    graphicConfig: DashboardGraphicConfigProps;
}
