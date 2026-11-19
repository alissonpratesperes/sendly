import React from 'react';

import * as S from '../styles/emptyState.style';

import { EmptyStateProps } from '../interfaces/emptyStateProps.interface';

export const EmptyState: React.FC<EmptyStateProps> = ({ message = "Nenhum registro encontrado" }) => {
    return (
        <S.EmptyStateContainer>
            <S.EmptyStateIcon />

            <S.EmptyStateText> { message || "Nenhum registro encontrado" } </S.EmptyStateText>
        </S.EmptyStateContainer>
    );
}
