import React, { Fragment } from 'react';

import * as SharedStyles from '../styles/Home.style';

const Home: React.FC = () => {
    return (
        <Fragment>
            <SharedStyles.HeaderWrapper>
                <SharedStyles.SessionInformationWrapper>
                    <SharedStyles.SessionTitle> Gerenciar envios </SharedStyles.SessionTitle>

                    <SharedStyles.SessionSubtitle> Monitore os envios realizados, e fique por dentro da execução </SharedStyles.SessionSubtitle>
                </SharedStyles.SessionInformationWrapper>
            </SharedStyles.HeaderWrapper>

        <SharedStyles.IframeContainer>
            <SharedStyles.BullBoardIframe
                src={ process.env.REACT_APP_BULL_BOARD_URL }
                style={{ colorScheme: "light" }}
                title="Sendly - Dashboard"
            />
        </SharedStyles.IframeContainer>
        </Fragment>
    );
}

export default Home;
