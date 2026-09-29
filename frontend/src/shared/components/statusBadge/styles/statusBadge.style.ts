import styled from 'styled-components';

import { StatusBadgeProps } from '../interfaces/statusBadgeProps.interface';
import { STATUS_BADGE_CONFIG } from '../constants/statusBadgeConfig.constant';

export const StatusBadgeContainer = styled.span<StatusBadgeProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    font-family: "Lato";
    font-weight: 600;
    font-size: 15px;
    text-transform: uppercase;

    color: ${ ({ variant }) => STATUS_BADGE_CONFIG[variant].fontColor };
`;
