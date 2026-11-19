import React, { Fragment } from 'react';
import parsePhoneNumberFromString from 'libphonenumber-js';

import * as S from '../styles/connectionBadge.style';
import * as I from '../../../shared/styles/icon.style';

import { ConnectionBadgeProps } from '../interfaces/connectionBadgeProps.interface';
import { CONNECTION_BADGE_CONFIG } from '../constants/connectionBadgeConfig.constant';

export const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({ variant, phone }) => {
    const badgeConfig = CONNECTION_BADGE_CONFIG[variant];

    if (!badgeConfig) {
        return null;
    }

    const Icon = badgeConfig.icon;

    return (
        <S.ConnectionBadgeContainer variant={ variant }>
            <S.ConnectionLabel>
                <Icon size={ 30 }/>

                { badgeConfig.label }
            </S.ConnectionLabel>

            { phone && (
                <Fragment>
                    •

                    <S.ConnectionPhone>
                        <I.SmartphoneIcon/>

                        { phone ? parsePhoneNumberFromString(`+${ phone }`)?.formatNational() ?? '—' : "" }
                    </S.ConnectionPhone>
                </Fragment>
            ) }
        </S.ConnectionBadgeContainer>
    );
}
