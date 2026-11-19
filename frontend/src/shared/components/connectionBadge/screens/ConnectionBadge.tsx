import React, { Fragment } from 'react';
import parsePhoneNumberFromString from 'libphonenumber-js';

import * as I from '../../../shared/styles/icon.style';
import * as Styled from '../styles/connectionBadge.style';

import { ConnectionBadgeProps } from '../interfaces/connectionBadgeProps.interface';
import { CONNECTION_BADGE_CONFIG } from '../constants/connectionBadgeConfig.constant';

export const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({ variant, phone }) => {
    const badgeConfig = CONNECTION_BADGE_CONFIG[variant];

    if (!badgeConfig) {
        return null;
    }

    const Icon = badgeConfig.icon;

    return (
        <Styled.ConnectionBadgeContainer variant={ variant }>
            <Styled.ConnectionLabel>
                <Icon size={ 30 }/>

                { badgeConfig.label }
            </Styled.ConnectionLabel>

            { phone && (
                <Fragment>
                    •

                    <Styled.ConnectionPhone>
                        <I.SmartphoneIcon/>

                        { phone ? parsePhoneNumberFromString(`+${ phone }`)?.formatNational() ?? '—' : "" }
                    </Styled.ConnectionPhone>
                </Fragment>
            ) }
        </Styled.ConnectionBadgeContainer>
    );
}
