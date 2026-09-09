import { MoveLeft } from 'lucide-react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import * as Styled from '../styles/Registration.style';
import * as SharedStyles from '../../../../shared/styles/Registration.style';

import User from '../../../../core/user/screens/User';
import Chain from '../../../../core/chain/screens/Chain';
import Store from '../../../../core/store/screens/Store';
import Action from '../../../../core/action/screens/Action';
import Category from '../../../../core/category/screens/Category';
import Regional from '../../../../core/regional/screens/Regional';
import PrivateRoute from '../../private/components/PrivateRoute.component';

const navigationTabs = [
    { tabLabel: "Regional", buttonLabel: "regional", path: "regional" },
    { tabLabel: "Redes", buttonLabel: "rede", path: "chains" },
    { tabLabel: "Lojas", buttonLabel: "loja", path: "stores" },
    { tabLabel: "Usuários", buttonLabel: "usuário", path: "users" },
    { tabLabel: "Categorias de produtos", buttonLabel: "categoria", path: "product-categories" },
    { tabLabel: "Tipo de ação", buttonLabel: "tipo de ação", path: "action-type" }
];

const Registration: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <SharedStyles.HeaderWrapper>
                <SharedStyles.GoBackButton onClick={() => navigate(-1)}>
                    <MoveLeft size={20} />

                    <SharedStyles.GoBackButtonLabel> Voltar </SharedStyles.GoBackButtonLabel>
                </SharedStyles.GoBackButton>

                <SharedStyles.SessionInformationWrapper>
                    <SharedStyles.SessionTitle> Gerenciar cadastros </SharedStyles.SessionTitle>

                    <SharedStyles.SessionSubtitle> Crie, edite e gerencie os seus cadastros </SharedStyles.SessionSubtitle>
                </SharedStyles.SessionInformationWrapper>

                <Styled.NavigationTabs>
                    {navigationTabs.map(tab => {
                        const isActive = location.pathname.endsWith(tab.path);

                        return (
                            <Styled.NavigationTabButtons key={tab.path} onClick={() => navigate(`/registrations/${tab.path}`)} $active={isActive}>
                                <Styled.NavigationTabButtonText $active={isActive}> {tab.tabLabel} </Styled.NavigationTabButtonText>
                            </Styled.NavigationTabButtons>
                        );
                    })}
                </Styled.NavigationTabs>
            </SharedStyles.HeaderWrapper>

            <Routes>
                <Route path="/" element={<Navigate to="regional" replace />} />
                <Route path="/users" element={<User />} />
                <Route path="/chains" element={<Chain />} />
                <Route path="/stores" element={<Store />} />
                <Route path="action-type" element={<Action />} />
                <Route path="/regional" element={<Regional />} /> /* Voltar private route englobando as rotas */
                <Route path="/product-categories" element={<Category />} />
            </Routes>
        </>
    );
};

export default Registration;