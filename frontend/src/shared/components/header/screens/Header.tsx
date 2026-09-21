import React, { JSX, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseZapIcon, House, Power, RadioTower } from 'lucide-react';

import * as Styled from '../styles/header.style';
import Connection from '../../../components/connection/screens/Connection';
import { HeaderMenuLinksProps } from '../interfaces/headerMenuLinksProps.interface';
import { clearAuthenticationStorage, getAuthenticationStorage } from '../../../utils/authenticationStorage.util';

const menuLinksIconsMapping: Record<string, JSX.Element> = {
    home: <House size={ 25 } />,
    registrations: <DatabaseZapIcon size={ 25 } />,
}
const Header: React.FC<HeaderMenuLinksProps> = ({ links }) => {
    const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const { userInformation } = getAuthenticationStorage();

    const handleLogout = () => {
        clearAuthenticationStorage();

        navigate("/authentication");
    }

    return (
        <Styled.Container>
            <Styled.ApplicationBrandContainer>
                <Styled.ApplicationBrandMark> Sendly </Styled.ApplicationBrandMark>
            </Styled.ApplicationBrandContainer>

            <Styled.MenuContainer>
                { links.map(({ label, path }, index) => {
                    return (
                        <Styled.NavItem key={ index } to={ path }>
                            { menuLinksIconsMapping[path.replace("/", "") as keyof typeof menuLinksIconsMapping] }
                            { label }
                        </Styled.NavItem>
                    );
                }) }
            </Styled.MenuContainer>

            <Styled.UserContainer>
                <Styled.UserInformation>
                    <Styled.UserName> { userInformation?.name ?? "" } </Styled.UserName>
                    <Styled.UserCompany> { userInformation?.company?.name ?? "" } </Styled.UserCompany>
                </Styled.UserInformation>

                <Styled.UserActionContainer>
                    <Styled.WhatsAppButton type="button" onClick={ () => setIsConnectionOpen(true) }>
                        <RadioTower size={ 25 } />
                    </Styled.WhatsAppButton>
                    <Styled.LogOutButton type="button" onClick={ () => handleLogout() }>
                        <Power size={ 25 } />
                    </Styled.LogOutButton>
                </Styled.UserActionContainer>
            </Styled.UserContainer>

            { userInformation?.company?.id && (
                <Connection
                    onPairingSuccess={ false }
                    isOpen={ isConnectionOpen }
                    companyId={ userInformation.company.id }
                    entityName={ userInformation.company.name }
                    onClose={ () => setIsConnectionOpen(false) }
                />
            ) }
        </Styled.Container>
    );
}

export default Header;
