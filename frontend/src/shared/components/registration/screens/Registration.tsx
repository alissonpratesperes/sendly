import { Fragment } from 'react/jsx-runtime';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Contact, ListCheck, MessageSquare, NotebookPen, Users } from 'lucide-react';

import * as Styled from '../styles/Registration.style';

import User from '../../../../core/user/screens/User';





import Chain from '../../../../core/chain/screens/Chain';
import Store from '../../../../core/store/screens/Store';
import Action from '../../../../core/action/screens/Action';
import Category from '../../../../core/category/screens/Category';
import Regional from '../../../../core/regional/screens/Regional';
import PrivateRoute from '../../private/components/PrivateRoute.component';

const navigationTabs = [
    { icon: <Building2 size={25}/>, label: "Empresas", path: "regional" },
    { icon: <Users size={25}/>, label: "Usuários", path: "user" },
    { icon: <ListCheck size={25}/>, label: "Listas", path: "stores" },
    { icon: <Contact size={25}/>, label: "Contatos", path: "users" },
    { icon: <NotebookPen size={25}/>, label: "Anotações", path: "product-categories" },
    { icon: <MessageSquare size={25}/>, label: "Templates", path: "action-type" },
]
const Registration: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Fragment>
            <Styled.HeaderWrapper>
                <Styled.SessionInformationWrapper>
                    <Styled.SessionTitle> Gerenciar cadastros </Styled.SessionTitle>

                    <Styled.SessionSubtitle> Crie, edite e gerencie todos os seus cadastros </Styled.SessionSubtitle>
                </Styled.SessionInformationWrapper>
                <Styled.NavigationTabs>
                    { navigationTabs.map(tab => {
                        const isActive = location.pathname.endsWith(tab.path);

                        return (
                            <Styled.NavigationTabButtons key={ tab.path } onClick={ () => navigate(`/registrations/${tab.path}`) } $active={ isActive }>
                                {tab.icon}

                                <Styled.NavigationTabButtonText $active={ isActive }> { tab.label } </Styled.NavigationTabButtonText>
                            </Styled.NavigationTabButtons>
                        );
                    }) }
                </Styled.NavigationTabs>
            </Styled.HeaderWrapper>

            <Routes>
                <Route path="/" element={<Navigate to="user" replace />} />






                <Route path="/user" element={<User />} />
                <Route path="/chains" element={<Chain />} />
                <Route path="/stores" element={<Store />} />
                <Route path="action-type" element={<Action />} />
                <Route path="/regional" element={<Regional />} /> /* Voltar private route englobando as rotas */
                <Route path="/product-categories" element={<Category />} />
            </Routes>
        </Fragment>
    );
}

export default Registration;
