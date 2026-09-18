import React from 'react';

import * as Styled from '../styles/brand.style';

export const Brand: React.FC = () => {
    return (
        <Styled.ApplicationBrandContainer>
            <Styled.ApplicationBrandMark>
                Sendly
            </Styled.ApplicationBrandMark>
        </Styled.ApplicationBrandContainer>
    );
}
