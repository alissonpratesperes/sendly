import React from 'react';

import * as Styled from '../styles/copyright.style';

export const Copyright: React.FC = () => {
    return (
        <Styled.CopyrightContainer>
            <Styled.CopyrightContent>
                © 2026 Sendly | Todos os direitos reservados
            </Styled.CopyrightContent>
        </Styled.CopyrightContainer>
    );
}
