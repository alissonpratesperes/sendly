import { Fragment } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import User from '../../../../core/user/screens/User';
import * as Styled from '../styles/registration.style';
import Lists from '../../../../core/list/screens/Lists';
import { NavigationTab } from '../types/navigationTab.type';
import PrivateRoute from '../../private/screens/PrivateRoute';
import Company from '../../../../core/company/screens/Company';
import Contact from '../../../../core/contact/screens/Contact';
import Template from '../../../../core/template/screens/Template';
import { navigationTabs } from '../constants/navigationTabs.constant';

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
                <Route path="/" element={ <Navigate to="company" replace /> } />

                <Route path="/company" element={ <PrivateRoute element={ <Company /> }/> } />
                <Route path="/user" element={ <PrivateRoute element={ <User /> }/> } />
                <Route path="/list" element={ <PrivateRoute element={ <Lists /> }/> } />
                <Route path="/contact" element={ <PrivateRoute element={ <Contact /> }/> } />
                <Route path="/template" element={ <PrivateRoute element={ <Template /> }/> } />
            </Routes>
        </Fragment>
    );
}

export default Registration;
