import React, { Fragment } from 'react';
import { KeyRound } from 'lucide-react';

import * as Styled from '../styles/pairingCode.style';
import * as ModalStyled from '../../../styles/modal.style';
import { PairingCodeProps } from '../interfaces/pairingCodeProps.interface';

const PairingCode: React.FC<PairingCodeProps> = ({ pairingCode }) => {
    const formattedPairingCode = pairingCode.replace(/[^a-zA-Z0-9]/g, "").split("");

    return (
        <Fragment>
            <Styled.PairingCodeTextContainer>
                <KeyRound size={ 25 } color="#2F2E33" />

                <ModalStyled.ModalBoldText>
                    Insira o código abaixo no seu aplicativo do WhatsApp
                </ModalStyled.ModalBoldText>
            </Styled.PairingCodeTextContainer>

            <Styled.PairingCodeDigitsContainer>
                { formattedPairingCode.map((char, index) => (
                    <Fragment key={ index }>
                        <Styled.PairingCodeCharactersCards> { char } </Styled.PairingCodeCharactersCards>

                        { index === 3 && (<Styled.PairingCodeCharactersSeparator> - </Styled.PairingCodeCharactersSeparator>) }
                    </Fragment>
                )) }
            </Styled.PairingCodeDigitsContainer>
        </Fragment>
    );
}

export default PairingCode;
