import React, { Fragment } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { Main } from './shared/styles/Global.style';
import Login from './core/authentication/screens/Login';
import Reset from './core/authentication/screens/Reset';
import Home from './shared/components/home/screens/Home';
import Forgot from './core/authentication/screens/Forgot';
import Header from './shared/components/header/screens/Header';
import PublicRoute from './shared/components/public/screens/PublicRoute';
import PrivateRoute from './shared/components/private/screens/PrivateRoute';
import { AppRoutes } from './shared/components/header/enums/appRoutes.enum';
import Registration from './shared/components/registration/screens/Registration';
import { getAuthenticationStorage } from './shared/utils/authenticationStorage.util';

const PATHS_WITHOUT_APP_LAYOUT = [ "/authentication", "/authentication/", "/authentication/forgot", "/authentication/reset", ];

export const AppRouting: React.FC = () => {
    const location = useLocation();
    const { userInformation } = getAuthenticationStorage();
    const shouldUseAppLayout = !PATHS_WITHOUT_APP_LAYOUT.includes(location.pathname);
    const links = [ ...(userInformation?.isSystemRoot ? [ { label: "Início", path: AppRoutes.HOME }, { label: "Cadastros", path: AppRoutes.REGISTRATIONS } ] : []), ];

    return (
        <Fragment>
            { shouldUseAppLayout && (<Header links={ links } />) }

            <Main applyPadding={ shouldUseAppLayout }>
                <Routes>
                    <Route path="/authentication" element={ <PublicRoute element={ <Login /> }/> }/>
                    <Route path="/authentication/reset" element={ <PublicRoute element={ <Reset /> }/> }/>
                    <Route path="/authentication/forgot" element={ <PublicRoute element={ <Forgot /> }/> }/>

                    <Route path="/" element={ <Navigate to={ userInformation?.isSystemRoot ? "/home" : "/registrations" } replace /> }/>
                    <Route path="/home" element={ userInformation?.isSystemRoot ? <PrivateRoute element={ <Home /> }/> : <Navigate to="/registrations" replace /> }/>
                    <Route path="/registrations/*" element={ <PrivateRoute element={ <Registration /> }/> }/>

                    <Route path="*" element={ <Navigate to="/" replace /> }/>
                </Routes>
            </Main>
        </Fragment>
    );
}
