import React, { Fragment } from 'react';

import * as S from '../styles/pairingCode.style';
import * as M from '../../../styles/modal.style';
import * as I from '../../../../shared/styles/icon.style';

import { PairingCodeProps } from '../interfaces/pairingCodeProps.interface';

export const PairingCode: React.FC<PairingCodeProps> = ({ pairingCode }) => {
    const formattedPairingCode = pairingCode.replace(/[^a-zA-Z0-9]/g, "").split("");

    return (
        <Fragment>
            <S.PairingCodeTextContainer>
                <I.KeyRoundIcon/>

                <M.ModalBoldText> Insira o código abaixo no seu aplicativo do WhatsApp </M.ModalBoldText>
            </S.PairingCodeTextContainer>

            <S.PairingCodeDigitsContainer>
                { formattedPairingCode.map((char, index) => (
                    <Fragment key={ index }>
                        <S.PairingCodeCharactersCards> { char } </S.PairingCodeCharactersCards>

                        { index === 3 && (<S.PairingCodeCharactersSeparator> • </S.PairingCodeCharactersSeparator>) }
                    </Fragment>
                )) }
            </S.PairingCodeDigitsContainer>
        </Fragment>
    );
}
