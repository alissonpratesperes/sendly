import styled from 'styled-components';

import { ConnectionBadgeVariant } from '../enums/connectionBadgeVariant.enum';
import { ConnectionBadgeProps } from '../interfaces/connectionBadgeProps.interface';
import { CONNECTION_BADGE_CONFIG } from '../constants/connectionBadgeConfig.constant';

export const ConnectionStatusContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 15px;
`;

export const ConnectionBadgeContainer = styled.span<ConnectionBadgeProps>`
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 15px;
    font-family: "Inter";
    font-weight: 500;
    font-size: 16px;
    border-radius: 50px;

    color: ${ ({ variant }) => CONNECTION_BADGE_CONFIG[variant].fontColor };
    margin-bottom: ${ ({ variant }) => variant === ConnectionBadgeVariant.CONNECTED ? "0px" : "30px" };
    background-color: ${ ({ variant }) => CONNECTION_BADGE_CONFIG[variant].backgroundColor };
`;
