import React from 'react';

import * as S from '../styles/copyright.style';

export const Copyright: React.FC = () => {
    return (
        <S.CopyrightContainer>
            <S.CopyrightContent>
                © 2026 Sendly • Todos os direitos reservados
            </S.CopyrightContent>
        </S.CopyrightContainer>
    );
}
