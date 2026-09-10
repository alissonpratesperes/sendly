import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Main } from './shared/styles/Global.style';
import Login from './core/authentication/screens/Login';
import Reset from './core/authentication/screens/Reset';
import Forgot from './core/authentication/screens/Forgot';


/* Daqui pra cima, ok */



import Home from './shared/components/home/screens/Home';
import Commercial from './core/commercial/screens/Commercial';
import Header from './shared/components/header/screens/Header';
import CommercialDetails from './core/commercial/screens/CommercialDetails';
import Registration from './shared/components/registration/screens/Registration';
import PrivateRoute from './shared/components/private/components/PrivateRoute.component';

export const AppRouting: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const shouldRenderHeader = location.pathname !== '/authentication' && location.pathname !== '/authentication/reset' && location.pathname !== '/authentication/forgot';
    const applyPadding = location.pathname !== '/authentication' && location.pathname !== '/authentication/reset' && location.pathname !== '/authentication/forgot';

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
                    <Route path="/authentication" element={<Login />} />
                    <Route path="/authentication/reset" element={<Reset />} />
                    <Route path="/authentication/forgot" element={<Forgot />} />
                    <Route path="/home" element={<PrivateRoute element={ <Home /> }/>} />
                    <Route path="/" element={<PrivateRoute element={ <Navigate to="/home" replace /> }/>} />
                    <Route path="*" element={localStorage.getItem("accessToken") ? (<Navigate to="/home" replace />) : (<Navigate to="/authentication" replace />)} />

                    /* Daqui pra cima, ok */





                    <Route path="/registrations/*" element={<PrivateRoute element={ <Registration /> }/>} />
                    <Route path="/commercial-actions" element={<PrivateRoute element={ <Commercial /> }/>} />
                    <Route path="/commercial-actions/:id" element={<PrivateRoute element={ <CommercialDetails /> } />} />
                </Routes>
            </Main>
        </>
    );
};