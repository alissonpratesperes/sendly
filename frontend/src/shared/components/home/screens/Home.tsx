import React, { Fragment } from 'react';

import * as S from '../styles/home.style';
import * as G from '../../../styles/global.style';

export const Home: React.FC = () => {
    return (
        <Fragment>
            <S.HeaderWrapper>
                <G.SessionInformationWrapper>
                    <G.SessionTitle> Gerenciar envios </G.SessionTitle>

                    <G.SessionSubtitle> Monitore os envios, e fique por dentro da execução </G.SessionSubtitle>
                </G.SessionInformationWrapper>
            </S.HeaderWrapper>

            <S.IframeContainer>
                <S.BullBoardIframe src={ process.env.REACT_APP_BULL_BOARD_URL } style={{ colorScheme: "light" }} title="Sendly - Dashboard"/>
            </S.IframeContainer>
        </Fragment>
    );
}
