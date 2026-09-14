import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { verifyExpiredToken } from '../../../utils/verifyExpiredToken.util';
import { PrivateRouteProps } from '../interfaces/privateRouteProps.interface';
import { clearAuthenticationStorage, getAuthenticationStorage } from '../../../utils/authenticationStorage.util';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const { accessToken } = getAuthenticationStorage();

        if (accessToken && !verifyExpiredToken(accessToken)) {
            setIsAuthorized(true);
        } else {
            clearAuthenticationStorage();

            setIsAuthorized(false);
        }
    }, []);
    useEffect(() => {
        if (isAuthorized === false) {
            toast.error("Você precisa estar autenticado");

            navigate("/authentication", { replace: true });
        }
    }, [isAuthorized, navigate]);

    if (isAuthorized === null) {
        return null;
    }

    return isAuthorized ? element : null;
}

export default PrivateRoute;
