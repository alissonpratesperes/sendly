import styled from 'styled-components';
import { BarLoader, PropagateLoader } from 'react-spinners';

export const LoadingStateContainer = styled.div`
    height: 55px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
`;

export const LoadingStateBar = styled(BarLoader).attrs({ height: 8, width: "100%", color: "#1C70E9", })`
    margin-top: 7px;
    border-radius: 16px;
`;

export const LoadingStateSpinner = styled(PropagateLoader).attrs({ size: 25, color: "#1C70E9", })``;