import React from 'react';

import * as S from '../styles/toast.style';

import { ValidationErrorToastProps } from '../interfaces/validationErrorToastProps.interface';

export const Toast: React.FC<ValidationErrorToastProps> = ({ errors }) => (
    <S.ToastWrapper>
        <S.Title> Erros de validação </S.Title>

        <S.List>
            { errors.map((issue, index) => (
                <S.ListItem key={ index }> { issue.message } </S.ListItem>
            )) }
        </S.List>
    </S.ToastWrapper>
)
