import * as z from 'zod';
import Select from 'react-select';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import { Create, Update } from '../services/Chain.service';
import { ChainFormData } from '../schemas/ChainFormSchema.schema';
import Toast from '../../../shared/components/toast/screens/Toast';
import { ChainFormSchema } from '../schemas/ChainFormSchema.schema';
import { ChainFormProps } from '../interfaces/ChainFormProps.interface';
import * as RegistrationSharedStyled from '../../../shared/styles/Registration.style';
import * as Styled from '../../../shared/components/drawer/styles/genericDrawer.style';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';

export const ChainForm: React.FC<ChainFormProps> = ({ initialValues, onSubmit, onCancel }) => {
    const statusOptions = [{ value: true, label: 'Ativo' }, { value: false, label: 'Inativo' }];
    const [formData, setFormData] = useState<ChainFormData>({
        id: undefined,
        nome: "",
        ativo: true
    });

    const { showLoading, hideLoading } = useLoading();

    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        try {
            showLoading();

            const validatedFormData = ChainFormSchema.parse(formData);

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
                <Styled.Label htmlFor="nome"> Nome da rede </Styled.Label>

                <Styled.Input id="nome" name="nome" placeholder="Digite o nome da rede" value={formData.nome} onChange={handleChange} />
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
                <Styled.FooterButton type="submit" $variant="primary"> {initialValues?.id ? 'Atualizar rede' : 'Cadastrar rede'} </Styled.FooterButton>
            </Styled.Footer>
        </Styled.Form>
    );
};