import styled from 'styled-components';

import { UserBadgeVariant } from '../types/userBadgeVariant.type';
import { UserBadgeProps } from '../interfaces/userBadgeProps.interface';
import { UserBadgeColorProps } from '../interfaces/userBadgeColorProps.interface';

const userBadgeColorMapping: Record<UserBadgeVariant, UserBadgeColorProps> = {
    isFirstAccess: { fontColor: "#DC143C", backgroundColor: "#FDECEF", },
    notIsFirstAccess: { fontColor: "#10CF67", backgroundColor: "#ECFDF3", },
    isSystemRoot: { fontColor: "#6941C6", backgroundColor: "#F9F5FF", },
    notIsSystemRoot: { fontColor: "#535862", backgroundColor: "#F5F5F5", },
}

export const UserBadgeContainer = styled.span<UserBadgeProps>`
    padding: 5px;
    max-height: 25px;
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Inter";
    font-weight: 500;
    font-size: 13px;
    border-radius: 50px;

    color: ${ ({ variant }) => userBadgeColorMapping[variant].fontColor };
    background-color: ${ ({ variant }) => userBadgeColorMapping[variant].backgroundColor };
`;
