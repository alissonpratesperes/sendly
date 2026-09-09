import * as z from 'zod';
import Select from 'react-select';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import { Create, Update } from '../services/Category.service';
import Toast from '../../../shared/components/toast/screens/Toast';
import { CategoryFormData } from '../schemas/CategoryFormSchema.schema';
import { CategoryFormSchema } from '../schemas/CategoryFormSchema.schema';
import { CategoryFormProps } from '../interfaces/CategoryFormProps.interface';
import * as RegistrationSharedStyled from '../../../shared/styles/Registration.style';
import * as Styled from '../../../shared/components/drawer/styles/GenericDrawer.style';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialValues, onSubmit, onCancel }) => {
    const statusOptions = [{ value: true, label: 'Ativo' }, { value: false, label: 'Inativo' }]
    const [formData, setFormData] = useState<CategoryFormData>({
        id: undefined,
        nome: "",
        ativo: true
    });

    const { showLoading, hideLoading } = useLoading();

    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        try {
            showLoading();

            const validatedFormData = CategoryFormSchema.parse(formData);

            initialValues?.id ? await Update(initialValues.id, validatedFormData) : await Create(validatedFormData);

            onSubmit();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error(<Toast errors={error.issues} />);
            } else {
                console.error(error);
            };
        } finally {
            hideLoading();
        };
    };
    const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = changeEvent.target;

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
        };
    }, [initialValues]);

    return (
        <Styled.Form onSubmit={handleSubmit}>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="nome"> Nome da categoria de produto </Styled.Label>

                <Styled.Input id="nome" name="nome" placeholder="Digite aqui" value={formData.nome} onChange={handleChange} />
            </Styled.FieldWrapper>

            <Styled.FieldWrapper>
                <Styled.Label htmlFor="ativo"> Status </Styled.Label>

                <Select
                    inputId="ativo"
                    isClearable={false}
                    options={statusOptions}
                    components={{ IndicatorSeparator: () => null }}
                    styles={RegistrationSharedStyled.SelectCommonStyles}
                    value={statusOptions.find(option => option.value === formData.ativo) || null}
                    onChange={(option) => setFormData(prev => ({ ...prev, ativo: option?.value || false }))}
                />
            </Styled.FieldWrapper>

            <Styled.Footer>
                <Styled.FooterButton type="button" $variant="secondary" onClick={onCancel}> Cancelar </Styled.FooterButton>
                <Styled.FooterButton type="submit" $variant="primary"> {initialValues?.id ? 'Atualizar categoria' : 'Cadastrar categoria'} </Styled.FooterButton>
            </Styled.Footer>
        </Styled.Form>
    );
};