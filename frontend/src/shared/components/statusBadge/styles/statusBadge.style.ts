import styled from 'styled-components';

import { StatusBadgeProps } from '../interfaces/statusBadgeProps.interface';
import { STATUS_BADGE_CONFIG } from '../constants/statusBadgeConfig.constant';

export const StatusBadgeContainer = styled.span<StatusBadgeProps>`
    height: 25px;
    width: 135px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 500;
    font-size: 15px;
    border-radius: 50px;

    color: ${ ({ variant }) => STATUS_BADGE_CONFIG[variant].fontColor };
    background-color: ${ ({ variant }) => STATUS_BADGE_CONFIG[variant].backgroundColor };
`;
