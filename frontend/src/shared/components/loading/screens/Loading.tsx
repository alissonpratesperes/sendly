import React from 'react';

import * as Styled from '../styles/Loading.style';
import PiracanjubaLogo from '../../../../assets/piracanjuba_logo.png';

export const GlobalLoading: React.FC = () => {
    return (
        <Styled.Overlay>
            <Styled.LoadingContentContainer>
                <Styled.LoadingBarWrapper> <Styled.LoadingBar /> </Styled.LoadingBarWrapper>
            </Styled.LoadingContentContainer>
        </Styled.Overlay>
    );
};