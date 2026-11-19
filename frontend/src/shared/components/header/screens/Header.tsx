import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as S from '../styles/header.style';

import { Connection } from '../../../components/connection/screens/Connection';
import { HeaderMenuLinksProps } from '../interfaces/headerMenuLinksProps.interface';
import { HEADER_MENU_ICONS_CONFIG } from '../constants/headerMenuIconsConfig.constant';
import { Logout } from '../../../../core/authentication/services/authentication.service';
import { clearAuthenticationStorage, getAuthenticationStorage } from '../../../utils/authenticationStorage.util';

export const Header: React.FC<HeaderMenuLinksProps> = ({ links }) => {
    const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const { userInformation } = getAuthenticationStorage();

    const handleLogout = async () => {
        await Logout();

        clearAuthenticationStorage();

        toast.info("Logout realizado com sucesso");

        navigate("/authentication");
    }

    return (
        <S.Container>
            <S.MenuContainer>
                { links.map(({ label, path }) => {
                    const Icon = HEADER_MENU_ICONS_CONFIG[path];

                    return (
                        <S.NavItem key={ path } to={ path }>
                            { Icon && <Icon size={ 25 }/> }
                            { label }
                        </S.NavItem>
                    );
                }) }
                { !userInformation?.isSystemRoot && (
                    <S.WhatsAppButton type="button" onClick={ () => setIsConnectionOpen(true) }>
                        <S.WhatsAppButtonIcon/>

                        WhatsApp
                    </S.WhatsAppButton>
                ) }
            </S.MenuContainer>

            <S.UserContainer>
                <S.UserInformation>
                    <S.UserName> { userInformation?.name ?? "" } </S.UserName>
                    <S.UserCompany> { userInformation?.company?.name ?? "" } </S.UserCompany>
                </S.UserInformation>

                <S.UserActionContainer>
                    <S.LogOutButton type="button" onClick={ () => handleLogout() }>
                        <S.LogOutButtonIcon/>
                    </S.LogOutButton>
                </S.UserActionContainer>
            </S.UserContainer>

            { userInformation?.company?.id && (
                <Connection onPairingSuccess={ false } isOpen={ isConnectionOpen } companyId={ userInformation.company.id } onClose={ () => setIsConnectionOpen(false) }/>
            ) }
        </S.Container>
    );
}
