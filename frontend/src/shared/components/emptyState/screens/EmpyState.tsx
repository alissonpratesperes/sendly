import React from 'react';
import { DatabaseSearch } from 'lucide-react';

import * as Styled from '../styles/emptyState.style';
import { EmptyStateProps } from '../interfaces/emptyStateProps.interface';

export const EmptyState: React.FC<EmptyStateProps> = ({ message = "Nenhum registro encontrado" }) => {
    return (
        <Styled.EmptyStateContainer>
            <DatabaseSearch size={ 55 } color="#1C70E9" />

            <Styled.EmptyStateText> { message || "Nenhum registro encontrado" } </Styled.EmptyStateText>
        </Styled.EmptyStateContainer>
    );
}
