import React from 'react';
import { Navigate } from 'react-router-dom';

import { PublicRouteProps } from '../interfaces/publicRouteProps.interface';

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
    const accessToken = localStorage.getItem("accessToken");

    return accessToken ? <Navigate to="/home" replace /> : element;
}

export default PublicRoute;
