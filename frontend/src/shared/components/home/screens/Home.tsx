import React, { Fragment } from 'react';

import * as Styled from '../styles/home.style';
import * as G from '../../../styles/global.style';

export const Home: React.FC = () => {
    return (
        <Fragment>
            <Styled.HeaderWrapper>
                <G.SessionInformationWrapper>
                    <G.SessionTitle> Gerenciar envios </G.SessionTitle>

                    <G.SessionSubtitle> Monitore os envios, e fique por dentro da execução </G.SessionSubtitle>
                </G.SessionInformationWrapper>
            </Styled.HeaderWrapper>

            <Styled.IframeContainer>
                <Styled.BullBoardIframe src={ process.env.REACT_APP_BULL_BOARD_URL } style={{ colorScheme: "light" }} title="Sendly - Dashboard"/>
            </Styled.IframeContainer>
        </Fragment>
    );
}
