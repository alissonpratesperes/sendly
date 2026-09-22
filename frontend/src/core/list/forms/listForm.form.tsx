import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import { Create, Update } from '../services/list.service';
import Toast from '../../../shared/components/toast/screens/Toast';
import { CreateListCommandDto } from '../dtos/createListCommand.dto';
import { UpdateListCommandDto } from '../dtos/updateListCommand.dto';
import { FormProps } from '../../../shared/interfaces/formProps.interface';
import * as Styled from '../../../shared/components/drawer/styles/drawer.style';
import { ListFormData, ListFormSchema } from '../schemas/listFormSchema.schema';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';

export const ListForm: React.FC<FormProps<ListFormData>> = ({ initialValues, onSubmit, onLoadingChange, }) => {
    const { userInformation } = getAuthenticationStorage();

    const [formData, setFormData] = useState<ListFormData>({ companyId: 0, name: "", subject: "", color: "", });

    const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = changeEvent.target;

        setFormData((previous: ListFormData) => ({
            ...previous,

            [name]: value,
        }));
    }
    const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

        onLoadingChange(true);

        try {
            const validatedFormData = ListFormSchema.parse(formData);

            if (initialValues?.id === undefined) {
                const command: CreateListCommandDto = {
                    companyId: userInformation?.company.id ?? 0,
                    name: validatedFormData.name,
                    subject: validatedFormData.subject,
                    color: validatedFormData.color,
                }

                await Create(command);

                toast.success("Lista criada com sucesso");
            } else {
                const command: UpdateListCommandDto = {
                    name: validatedFormData.name,
                    subject: validatedFormData.subject,
                    color: validatedFormData.color,
                }

                await Update({ id: initialValues.id }, command);

                toast.success("Lista editada com sucesso");
            }

            onSubmit();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error(<Toast errors={error.issues} />);
            } else {
                toast.error("Não é possível prosseguir com a solicitação");
            }
        } finally {
            onLoadingChange(false);
        }
    }

    useEffect(() => {
        if (initialValues) {
            setFormData({
                id: initialValues.id,
                companyId: initialValues.companyId,
                name: initialValues.name,
                subject: initialValues.subject,
                color: initialValues.color,
            });
        } else {
            setFormData({ companyId: 0, name: "", subject: "", color: "#FFFFFF", });
        }
    }, [ initialValues ]);

    return (
        <Styled.Form id="list-form" onSubmit={ handleSubmit }>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="name"> Nome </Styled.Label>

                <Styled.Input id="name" name="name" placeholder="Digite o nome da lista" value={ formData.name } onChange={ handleChange } />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="subject"> Assunto </Styled.Label>

                <Styled.Input id="subject" name="subject" placeholder="Digite o assunto da lista" value={ formData.subject } onChange={ handleChange } />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="color"> Cor </Styled.Label>

                <Styled.ColorInput type="color" id="color" name="color" placeholder="" value={ formData.color } onChange={ handleChange } />
            </Styled.FieldWrapper>
        </Styled.Form>
    );
}
