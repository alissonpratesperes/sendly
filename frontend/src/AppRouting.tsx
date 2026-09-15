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
import Registration from './shared/components/registration/screens/Registration';

const PATHS_WITHOUT_APP_LAYOUT = [ "/authentication", "/authentication/forgot", "/authentication/reset", ];

export const AppRouting: React.FC = () => {
    const location = useLocation();
    const shouldUseAppLayout = !PATHS_WITHOUT_APP_LAYOUT.includes(location.pathname);

    return (
        <Fragment>
            { shouldUseAppLayout && (
                <Header
                    links={[
                        { label: "Home", path: "/home" },
                        { label: "Cadastros", path: "/registrations" },
                    ]}
                />
            ) }

            <Main applyPadding={ shouldUseAppLayout }>
                <Routes>
                    <Route path="/authentication" element={ <PublicRoute element={ <Login /> } /> } />
                    <Route path="/authentication/reset" element={ <PublicRoute element={ <Reset /> } /> } />
                    <Route path="/authentication/forgot" element={ <PublicRoute element={ <Forgot /> } /> } />

                    <Route path="/" element={ <Navigate to="/home" replace /> } />
                    <Route path="/home" element={ <PrivateRoute element={ <Home /> }/> } />
                    <Route path="/registrations/*" element={ <PrivateRoute element={ <Registration /> }/> } />

                    <Route path="*" element={ <Navigate to="/" replace /> } />
                </Routes>
            </Main>
        </Fragment>
    );
}
