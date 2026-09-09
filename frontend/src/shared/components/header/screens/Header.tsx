import { useNavigate } from 'react-router-dom';
import React, { JSX, useEffect, useRef, useState } from 'react';
import { Home, Store, ClipboardList, CircleDollarSign, LogOut, RotateCcwKey } from 'lucide-react';

import * as Styled from '../styles/Header.style';
import { HeaderMenuLinksProps } from '../interfaces/HeaderMenuLinksProps.interface';

const menuLinksIconsMapping: Record<string, JSX.Element> = {
    home: <Home size={20} />,
    registrations: <Store size={20} />,
    'commercial-actions': <ClipboardList size={20} />,
    financial: <CircleDollarSign size={20} />
};

const Header: React.FC<HeaderMenuLinksProps> = ({ links }) => {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };
    const handleLogout = () => {
        localStorage.clear();

        navigate('/auth');
    };
    const handleChangePassword = () => {
        const isFirstAccess = false;

        navigate('/auth/alterarSenha', { state: { primeiroAcesso: isFirstAccess } });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            };
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Styled.Container>
            <Styled.MenuContainer>
                {links.map(({ label, path }, index) => {
                    const linkIconKey = path.replace('/', '') as keyof typeof menuLinksIconsMapping;

                    return (
                        <Styled.NavItem key={index} to={path}> {menuLinksIconsMapping[linkIconKey]} {label} </Styled.NavItem>
                    );
                })}
            </Styled.MenuContainer>

            <Styled.LogoutClickableContainer>
                {isDropdownOpen && (
                    <Styled.Dropdown ref={dropdownRef}>
                        <Styled.DropdownItem onClick={handleLogout}>
                            <LogOut size={20} />

                            <Styled.DropdownText> Sair </Styled.DropdownText>
                        </Styled.DropdownItem>
                        <Styled.DropdownItem onClick={handleChangePassword}>
                            <RotateCcwKey size={20} />

                            <Styled.DropdownText> Alterar senha </Styled.DropdownText>
                        </Styled.DropdownItem>
                    </Styled.Dropdown>
                )}
            </Styled.LogoutClickableContainer>
        </Styled.Container>
    );
};

export default Header;