import React from 'react';

import * as S from '../styles/statusBadge.style';

import { StatusBadgeProps } from '../interfaces/statusBadgeProps.interface';
import { STATUS_BADGE_CONFIG } from '../constants/statusBadgeConfig.constant';

export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant }) => {
    const badgeConfig = STATUS_BADGE_CONFIG[variant];
    const Icon = badgeConfig.icon;

    return (
        <S.StatusBadgeContainer variant={ variant }> <Icon size={ 25 } color={ badgeConfig.iconColor }/> </S.StatusBadgeContainer>
    );
}
