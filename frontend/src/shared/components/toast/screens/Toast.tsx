import React from 'react';

import * as Styled from '../styles/Toast.style';
import { ValidationErrorToastProps } from '../interfaces/ValidationErrorToastProps.interface';

const Toast: React.FC<ValidationErrorToastProps> = ({ errors }) => (
    <Styled.ToastWrapper>
        <Styled.Title> Erros de validação </Styled.Title>

        <Styled.List>
            {errors.map((issue, index) => (
                <Styled.ListItem key={index}> {issue.message} </Styled.ListItem>
            ))}
        </Styled.List>
    </Styled.ToastWrapper>
);

export default Toast;