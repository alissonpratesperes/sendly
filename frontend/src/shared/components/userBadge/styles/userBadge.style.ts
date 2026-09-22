import styled from 'styled-components';

import { UserBadgeProps } from '../interfaces/userBadgeProps.interface';
import { USER_BADGE_CONFIG } from '../constants/userBadgeConfig.constant';

export const UserBadgeContainer = styled.span<UserBadgeProps>`
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

    color: ${ ({ variant }) => USER_BADGE_CONFIG[variant].fontColor };
    background-color: ${ ({ variant }) => USER_BADGE_CONFIG[variant].backgroundColor };
`;
