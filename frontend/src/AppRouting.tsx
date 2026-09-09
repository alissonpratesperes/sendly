import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Main } from './shared/styles/Global.style';
import Home from './shared/components/home/screens/Home';
import Commercial from './core/commercial/screens/Commercial';
import Header from './shared/components/header/screens/Header';
import FirstAccess from './core/firstAccess/screens/FirstAccess';
import Authentication from './core/authentication/screens/Authentication';
import CommercialDetails from './core/commercial/screens/CommercialDetails';
import Registration from './shared/components/registration/screens/Registration';
import PrivateRoute from './shared/components/private/components/PrivateRoute.component';

export const AppRouting: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const shouldRenderHeader = location.pathname !== '/authentication' && location.pathname !== '/authentication/alterarSenha';
    const applyPadding = location.pathname !== '/home' && location.pathname !== '/authentication' && location.pathname !== '/authentication/alterarSenha';

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token && location.pathname === "/authentication") {
            navigate("/home");
        };
    }, [location.pathname, navigate]);

    return (
        <>
            {shouldRenderHeader && (
                <Header
                    links={[
                        { label: 'Home', path: '/home' },
                        { label: 'Cadastros', path: '/registrations' },
                        { label: 'Ações comerciais', path: '/commercial-actions' },
                    ]}
                />
            )}

            <Main applyPadding={applyPadding}>
                <Routes>




                    <Route path="/authentication" element={<Authentication />} />
                    <Route path="/authentication/reset" element={<FirstAccess />} />

                    <Route path="/" element={<PrivateRoute element={ <Navigate to="/home" replace /> }/>} />
                    <Route path="/home" element={<PrivateRoute element={ <Home /> }/>} />
                    <Route path="/registrations/*" element={<PrivateRoute element={ <Registration /> }/>} />
                    <Route path="/commercial-actions" element={<PrivateRoute element={ <Commercial /> }/>} />
                    <Route path="/commercial-actions/:id" element={<PrivateRoute element={ <CommercialDetails /> } />} />
                    <Route path="*" element={localStorage.getItem("accessToken") ? (<Navigate to="/home" replace />) : (<Navigate to="/authentication" replace />)} />
                </Routes>
            </Main>
        </>
    );
};