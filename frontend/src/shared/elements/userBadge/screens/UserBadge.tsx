import React from 'react';

import * as Styled from '../styles/userBadge.style';
import { UserBadgeProps } from '../interfaces/userBadgeProps.interface';

const UserBadge: React.FC<UserBadgeProps> = ({ variant }) => {
    const userBadgelabelMapping = {
        isFirstAccess: "Inativo",
        notIsFirstAccess: "Ativo",
        isSystemRoot: "Administrador",
        notIsSystemRoot: "Usuário",
    }

    return (
        <Styled.UserBadgeContainer variant={ variant }>
            { userBadgelabelMapping[variant] }
        </Styled.UserBadgeContainer>
    );
}

export default UserBadge;
