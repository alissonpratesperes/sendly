import React from 'react';

import * as Styled from '../styles/statusBadge.style';
import { StatusBadgeProps } from '../interfaces/statusBadgeProps.interface';
import { STATUS_BADGE_CONFIG } from '../constants/statusBadgeConfig.constant';

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant }) => {
    const badgeConfig = STATUS_BADGE_CONFIG[variant];

    return (
        <Styled.StatusBadgeContainer variant={ variant }> { badgeConfig.label } </Styled.StatusBadgeContainer>
    );
}

export default StatusBadge;
