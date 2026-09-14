import React from 'react';
import { Navigate } from 'react-router-dom';

import { PublicRouteProps } from '../interfaces/publicRouteProps.interface';
import { getAuthenticationStorage } from '../../../utils/authenticationStorage.util';

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
    const { accessToken } = getAuthenticationStorage();

    return accessToken ? <Navigate to="/home" replace /> : element;
}

export default PublicRoute;
