import React, { Fragment } from 'react';

import * as Styled from '../styles/Home.style';

const Home: React.FC = () => {
    return (
        <Fragment>
            <Styled.HeaderWrapper>
                <Styled.SessionInformationWrapper>
                    <Styled.SessionTitle> Gerenciar envios </Styled.SessionTitle>

                    <Styled.SessionSubtitle> Monitore os envios realizados, e fique por dentro da execução </Styled.SessionSubtitle>
                </Styled.SessionInformationWrapper>
            </Styled.HeaderWrapper>

            <Styled.IframeContainer>
                <Styled.BullBoardIframe src={ process.env.REACT_APP_BULL_BOARD_URL } style={{ colorScheme: "light" }} title="Sendly - Dashboard"/>
            </Styled.IframeContainer>
        </Fragment>
    );
}

export default Home;
