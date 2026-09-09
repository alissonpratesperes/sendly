import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { GlobalLoading } from '../screens/Loading';
import { LoadingContextProps } from '../interfaces/LoadingContextProps.interface';
import { LoadingProviderProps } from '../interfaces/LoadingProviderProps.interface';

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const useLoading = (): LoadingContextProps => {
    return useContext(LoadingContext)!;
};

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = useCallback(() => setIsLoading(true), []);
    const hideLoading = useCallback(() => setIsLoading(false), []);

    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = 'hidden';

            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';

            document.documentElement.style.overflow = '';
        };

        return () => {
            document.body.style.overflow = '';

            document.documentElement.style.overflow = '';
        };
    }, [isLoading]);

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}

            {isLoading && <GlobalLoading />}
        </LoadingContext.Provider>
    );
};