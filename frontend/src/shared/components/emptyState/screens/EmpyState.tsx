import React from 'react';

import * as Styled from '../styles/emptyState.style';
import { EmptyStateProps } from '../interfaces/emptyStateProps.interface';

export const EmptyState: React.FC<EmptyStateProps> = ({ message = "Nenhum registro encontrado" }) => {
    return (
        <Styled.EmptyStateContainer>
            <Styled.EmptyStateIcon />

            <Styled.EmptyStateText> { message || "Nenhum registro encontrado" } </Styled.EmptyStateText>
        </Styled.EmptyStateContainer>
    );
}
