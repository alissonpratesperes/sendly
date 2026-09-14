import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import { Create, Update } from '../services/user.service';
import { UserFormData } from '../schemas/userFormSchema.schema';
import { UserFormSchema } from '../schemas/userFormSchema.schema';
import Toast from '../../../shared/components/toast/screens/Toast';
import { UserFormProps } from '../interfaces/userFormProps.interface';
import * as Styled from '../../../shared/components/drawer/styles/genericDrawer.style';

export const UserForm: React.FC<UserFormProps> = ({ initialValues, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
    })

    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        try {

            const isCreatingNewUser = !initialValues?.id;
            const validatedFormData = UserFormSchema.parse(formData);

            if (isCreatingNewUser) {
                await Create(validatedFormData);

                toast.success("Usuário criado com sucesso");
            } else {
                await Update({ id: initialValues.id! }, validatedFormData);

                toast.success("Usuário editado com sucesso");
            }

            onSubmit();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error(<Toast errors={error.issues} />);
            } else {
                toast.error(`Não é possível prosseguir com a solicitação: ${error}`);
            }
        } finally {
        }
    }
    const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = changeEvent.target;

        setFormData(prev => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
        } else {
            setFormData({
                name: "",
                email: "",
            });
        }
    }, [ initialValues ]);

    return (
        <Styled.Form id="user-form" onSubmit={handleSubmit}>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="name"> Nome </Styled.Label>

                <Styled.Input id="name" name="name" placeholder="Digite o nome do usuário" value={formData.name} onChange={ handleChange } />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="email"> Email </Styled.Label>

                <Styled.Input id="email" name="email" placeholder="Digite o e-mail do usuário" value={ formData.email } onChange={ handleChange } />
            </Styled.FieldWrapper>
        </Styled.Form>
    );
}
