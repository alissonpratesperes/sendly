import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import * as G from '../../../shared/styles/global.style';
import * as S from '../../../shared/components/drawer/styles/drawer.style';

import { Create, Update } from '../services/company.service';
import { Toast } from '../../../shared/components/toast/screens/Toast';
import { CreateCompanyCommandDto } from '../dtos/createCompanyCommand.dto';
import { UpdateCompanyCommandDto } from '../dtos/updateCompanyCommand.dto';
import { FormProps } from '../../../shared/interfaces/formProps.interface';
import { CompanyFormData, CompanyFormSchema } from '../schemas/companyFormSchema.schema';
import { formatCompanyDocument } from '../../../shared/utils/formatCompanyDocument.util';

export const CompanyForm: React.FC<FormProps<CompanyFormData>> = ({ initialValues, onSubmit, onLoadingChange, }) => {
    const [formData, setFormData] = useState<CompanyFormData>({ name: "", document: "", description: "", });

    const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = changeEvent.target;

        setFormData((previous: CompanyFormData) => ({
            ...previous,

            [name]: name === "document" ? value.replace(/\D/g, "").slice(0, 14) : value,
        }));
    }
    const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

        onLoadingChange(true);

        try {
            const validatedFormData = CompanyFormSchema.parse(formData);

            if (initialValues?.id === undefined) {
                const command: CreateCompanyCommandDto = {
                    name: validatedFormData.name,
                    document: validatedFormData.document,
                    description: validatedFormData.description || null,
                }

                await Create(command);

                toast.success("Empresa criada com sucesso");
            } else {
                const command: UpdateCompanyCommandDto = {
                    name: validatedFormData.name,
                    document: validatedFormData.document,
                    description: validatedFormData.description || null,
                }

                await Update({ id: initialValues.id }, command);

                toast.success("Empresa editada com sucesso");
            }

            onSubmit();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error(<Toast errors={ error.issues }/>);
            } else {
                toast.error("Não é possível prosseguir com a solicitação");
            }
        } finally {
            onLoadingChange(false);
        }
    }

    useEffect(() => {
        if (initialValues) {
            setFormData({ ...initialValues, document: initialValues.document.replace(/\D/g, "").slice(0, 14), });
        } else {
            setFormData({ ...formData, });
        }
    }, [ initialValues, ]);

    return (
        <S.Form id="company-form" onSubmit={ handleSubmit }>
            <S.FieldWrapper>
                <G.Label htmlFor="name"> Nome </G.Label>

                <G.Input id="name" name="name" placeholder="Digite o nome da empresa" value={ formData.name } onChange={ handleChange }/>
            </S.FieldWrapper>
            <S.FieldWrapper>
                <G.Label htmlFor="document"> CNPJ </G.Label>

                <G.Input id="document" name="document" placeholder="Digite o cnpj da empresa" value={ formatCompanyDocument(formData.document) } onChange={ handleChange }/>
            </S.FieldWrapper>
            <S.FieldWrapper>
                <G.Label htmlFor="description"> Descrição </G.Label>

                <G.Input id="description" name="description" placeholder="Digite uma descrição para a empresa" value={ formData.description } onChange={ handleChange }/>
            </S.FieldWrapper>
        </S.Form>
    );
}
