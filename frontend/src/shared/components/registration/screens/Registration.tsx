import { Fragment, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import * as G from '../../../styles/global.style';
import * as Styled from '../styles/registration.style';

import { User } from '../../../../core/user/screens/User';
import { NavigationTab } from '../types/navigationTab.type';
import { Lists } from '../../../../core/list/screens/Lists';
import { Batch } from '../../../../core/batch/screens/Batch';
import { PrivateRoute } from '../../private/screens/PrivateRoute';
import { Company } from '../../../../core/company/screens/Company';
import { Contact } from '../../../../core/contact/screens/Contact';
import { BatchSend } from '../../../../core/batch/screens/BatchSend';
import { Template } from '../../../../core/template/screens/Template';
import { navigationTabs } from '../constants/navigationTabs.constant';

export const Registration: React.FC = () => {
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Fragment>
            <Styled.HeaderWrapper>
                <G.SessionInformationWrapper>
                    <G.SessionTitle> Gerenciar cadastros </G.SessionTitle>

                    <G.SessionSubtitle> Crie, edite e gerencie todos os seus cadastros </G.SessionSubtitle>
                </G.SessionInformationWrapper>

                <Styled.NavigationTabs>
                    { navigationTabs.map((tab: NavigationTab) => {
                        const isHovered = hoveredTab === tab.path;
                        const isActive = location.pathname.endsWith(tab.path);

                        return (
                            <Styled.NavigationTabButtons key={ tab.path } onClick={ () => navigate(`/registrations/${tab.path}`) } onMouseEnter={ () => setHoveredTab(tab.path) } onMouseLeave={ () => setHoveredTab(null) } $active={ isActive } $hovered={ isHovered }>
                                { tab.icon }

                                <Styled.NavigationTabButtonText $active={ isActive }> { tab.label } </Styled.NavigationTabButtonText>
                            </Styled.NavigationTabButtons>
                        );
                    }) }
                </Styled.NavigationTabs>
            </Styled.HeaderWrapper>

            <Styled.ContentWrapper>
                <Routes>
                    <Route path="/" element={ <Navigate to="company" replace/> }/>

                    <Route path="/company" element={ <PrivateRoute element={ <Company/> }/> }/>
                    <Route path="/user" element={ <PrivateRoute element={ <User/> }/> }/>
                    <Route path="/list" element={ <PrivateRoute element={ <Lists/> }/> }/>
                    <Route path="/contact" element={ <PrivateRoute element={ <Contact/> }/> }/>
                    <Route path="/template" element={ <PrivateRoute element={ <Template/> }/> }/>
                    <Route path="/batch" element={ <PrivateRoute element={ <Batch/> }/> }/>
                    <Route path="/send" element={ <PrivateRoute element={ <BatchSend/> }/> }/>
                </Routes>
            </Styled.ContentWrapper>
        </Fragment>
    );
}
