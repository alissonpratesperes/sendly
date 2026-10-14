import styled from 'styled-components';

import { StatusBadgeProps } from '../interfaces/statusBadgeProps.interface';
import { STATUS_BADGE_CONFIG } from '../constants/statusBadgeConfig.constant';

export const StatusBadgeContainer = styled.span<StatusBadgeProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    color: ${ ({ variant }) => STATUS_BADGE_CONFIG[variant].iconColor };
`;
