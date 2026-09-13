import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { isTokenExpiredUtil } from '../../../utils/isTokenExpiredUtil.util';
import { PrivateRouteProps } from '../interfaces/PrivateRouterProps.interface';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken && !isTokenExpiredUtil(accessToken)) {
            setIsAuthorized(true);
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

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
