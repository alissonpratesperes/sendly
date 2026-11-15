import styled from 'styled-components';
import { DatabaseSearch } from 'lucide-react';

export const EmptyStateContainer = styled.div`
    height: 300px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export const EmptyStateIcon = styled(DatabaseSearch)`
    height: 55px;
    width: 55px;
    color: #FF6B00;
`;

export const EmptyStateText = styled.div`
    margin-top: 30px;
    font-family: "Inter";
    font-weight: 700;
    font-size: 18px;
    color: #535862;
`;
