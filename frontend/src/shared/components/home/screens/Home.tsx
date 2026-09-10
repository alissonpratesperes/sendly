import React from 'react';

import * as SharedStyles from '../styles/Home.style';
import { MoveLeft } from 'lucide-react';

const Home: React.FC = () => {
    return (

        <>
        <SharedStyles.HeaderWrapper>
<SharedStyles.GoBackButton  >
                    <MoveLeft size={20} />

                    <SharedStyles.GoBackButtonLabel> Voltar </SharedStyles.GoBackButtonLabel>
                </SharedStyles.GoBackButton>

                <SharedStyles.SessionInformationWrapper>
                    <SharedStyles.SessionTitle> Gerencie envios </SharedStyles.SessionTitle>

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
        </>
    );
}

export default Home;
