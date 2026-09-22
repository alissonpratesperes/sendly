import React from 'react';

import * as Styled from '../styles/connectionBadge.style';
import { ConnectionBadgeProps } from '../interfaces/connectionBadgeProps.interface';
import { CONNECTION_BADGE_CONFIG } from '../constants/connectionBadgeConfig.constant';

const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({ variant }) => {
    const badgeConfig = CONNECTION_BADGE_CONFIG[variant];

    if (!badgeConfig) {
        return null;
    }

    const Icon = badgeConfig.icon;

    return (
        <Styled.ConnectionBadgeContainer variant={ variant }>
            <Icon size={ 25 } />

            { badgeConfig.label }
        </Styled.ConnectionBadgeContainer>
    );
}

export default ConnectionBadge;
