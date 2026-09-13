import React, { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, DatabaseZapIcon, LogOut } from 'lucide-react';

import * as Styled from '../styles/header.style';
import { HeaderMenuLinksProps } from '../interfaces/headerMenuLinksProps.interface';

const menuLinksIconsMapping: Record<string, JSX.Element> = {
    home: <Rocket size={ 25 } />,
    registrations: <DatabaseZapIcon size={ 25 } />,
}
const Header: React.FC<HeaderMenuLinksProps> = ({ links }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        navigate("/authentication");
    }

    return (
        <Styled.Container>
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
