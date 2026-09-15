import React, { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseZapIcon, House, LogOut } from 'lucide-react';

import * as Styled from '../styles/header.style';
import { HeaderMenuLinksProps } from '../interfaces/headerMenuLinksProps.interface';
import { clearAuthenticationStorage } from '../../../utils/authenticationStorage.util';

const menuLinksIconsMapping: Record<string, JSX.Element> = {
    home: <House size={ 25 } />,
    registrations: <DatabaseZapIcon size={ 25 } />,
}
const Header: React.FC<HeaderMenuLinksProps> = ({ links }) => {
    const navigate = useNavigate();

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
                            { menuLinksIconsMapping[ path.replace("/", "") as keyof typeof menuLinksIconsMapping ] }
                            { label }
                        </Styled.NavItem>
                    );
                }) }
            </Styled.MenuContainer>
            <Styled.UserContainer>
                <Styled.UserInformation>
                    <Styled.UserName> Alisson Prates Peres </Styled.UserName>
                    <Styled.UserCompany> Thesle LTDA </Styled.UserCompany>
                </Styled.UserInformation>

                <Styled.UserActionContainer>
                    <Styled.LogOutButton type="button" onClick={ () => { handleLogout(); } }>
                        <LogOut size={ 25 } />
                    </Styled.LogOutButton>
                </Styled.UserActionContainer>
            </Styled.UserContainer>
        </Styled.Container>
    );
}

export default Header;
