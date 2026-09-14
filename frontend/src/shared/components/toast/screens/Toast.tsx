import React from 'react';

import * as Styled from '../styles/toast.style';
import { ValidationErrorToastProps } from '../interfaces/validationErrorToastProps.interface';

const Toast: React.FC<ValidationErrorToastProps> = ({ errors }) => (
    <Styled.ToastWrapper>
        <Styled.Title> Erros de validação </Styled.Title>

        <Styled.List>
            { errors.map((issue, index) => (
                <Styled.ListItem key={ index }> { issue.message } </Styled.ListItem>
            )) }
        </Styled.List>
    </Styled.ToastWrapper>
)

export default Toast;
