import { Fragment } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import User from '../../../../core/user/screens/User';
import * as Styled from '../styles/registration.style';
import { NavigationTab } from '../types/navigationTab.type';
import PrivateRoute from '../../private/screens/PrivateRoute';
import Company from '../../../../core/company/screens/Company';
import { navigationTabs } from '../constants/navigationTabs.constant';






import Chain from '../../../../core/chain/screens/Chain';
import Store from '../../../../core/store/screens/Store';
import Action from '../../../../core/action/screens/Action';

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
                    { navigationTabs.map((tab: NavigationTab) => {
                        const isActive = location.pathname.endsWith(tab.path);

                        return (
                            <Styled.NavigationTabButtons key={ tab.path } onClick={ () => navigate(`/registrations/${tab.path}`) } $active={ isActive }>
                                { tab.icon }

                                <Styled.NavigationTabButtonText $active={ isActive }> { tab.label } </Styled.NavigationTabButtonText>
                            </Styled.NavigationTabButtons>
                        );
                    }) }
                </Styled.NavigationTabs>
            </Styled.HeaderWrapper>

            <Routes>
                <Route path="/" element={<Navigate to="user" replace />} />
                <Route path="/user" element={ <PrivateRoute element={ <User /> }/> } />
                <Route path="/company" element={ <PrivateRoute element={ <Company /> }/> } />





                {/* Voltar private route englobando as rotas */}

                <Route path="/chains" element={<Chain />} />
                <Route path="/stores" element={<Store />} />
                <Route path="action-type" element={<Action />} />
            </Routes>
        </Fragment>
    );
}

export default Registration;
