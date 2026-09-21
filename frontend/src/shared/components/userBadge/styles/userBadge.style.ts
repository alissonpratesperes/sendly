import styled from 'styled-components';

import { UserBadgeProps } from '../interfaces/userBadgeProps.interface';
import { USER_BADGE_CONFIG } from '../constants/userBadgeConfig.constant';

export const UserBadgeContainer = styled.span<UserBadgeProps>`
    padding: 5px 10px;
    max-height: 25px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-family: "Inter", sans-serif;
    font-weight: 500;
    font-size: 13px;
    border-radius: 50px;

    color: ${ ({ variant }) => USER_BADGE_CONFIG[variant].fontColor };
    background-color: ${ ({ variant }) => USER_BADGE_CONFIG[variant].backgroundColor };
`;
