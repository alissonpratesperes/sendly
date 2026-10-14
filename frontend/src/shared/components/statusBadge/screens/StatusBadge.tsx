import React from 'react';

import * as Styled from '../styles/statusBadge.style';
import { StatusBadgeProps } from '../interfaces/statusBadgeProps.interface';
import { STATUS_BADGE_CONFIG } from '../constants/statusBadgeConfig.constant';

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant }) => {
    const badgeConfig = STATUS_BADGE_CONFIG[variant];
    const Icon = badgeConfig.icon;

    return (
        <Styled.StatusBadgeContainer variant={ variant }> <Icon size={ 25 } color={ badgeConfig.iconColor } /> </Styled.StatusBadgeContainer>
    );
}

export default StatusBadge;
