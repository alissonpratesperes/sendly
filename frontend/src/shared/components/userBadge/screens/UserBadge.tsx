import React from 'react';

import * as Styled from '../styles/userBadge.style';
import { UserBadgeProps } from '../interfaces/userBadgeProps.interface';
import { USER_BADGE_CONFIG } from '../constants/userBadgeConfig.constant';

const UserBadge: React.FC<UserBadgeProps> = ({ variant }) => {
    const badgeConfig = USER_BADGE_CONFIG[variant];

    if (!badgeConfig) {
        return null;
    }

    return (
        <Styled.UserBadgeContainer variant={ variant }>
            { badgeConfig.label }
        </Styled.UserBadgeContainer>
    );
}

export default UserBadge;
