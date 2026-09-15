import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import { Create, Update } from '../services/company.service';
import Toast from '../../../shared/components/toast/screens/Toast';
import { CreateCompanyCommandDto } from '../dtos/createCompanyCommand.dto';
import { UpdateCompanyCommandDto } from '../dtos/updateCompanyCommand.dto';
import { CompanyFormProps } from '../interfaces/companyFormProps.interface';
import * as Styled from '../../../shared/components/drawer/styles/drawer.style';
import { CompanyFormData, CompanyFormSchema } from '../schemas/companyFormSchema.schema';
import { formatCompanyDocument } from '../../../shared/utils/formatCompanyDocument.util';

export const CompanyForm: React.FC<CompanyFormProps> = ({ initialValues, onCancel, onSubmit }) => {
    const [formData, setFormData] = useState<CompanyFormData>({
        name: "",
        document: "",
        description: "",
    });

    const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = changeEvent.target;

        setFormData((previous: CompanyFormData) => ({
            ...previous,

            [name]: name === "document" ? value.replace(/\D/g, "").slice(0, 14) : value,
        }));
    }
    const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

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
                toast.error(<Toast errors={error.issues} />);
            } else {
                toast.error(`Não é possível prosseguir com a solicitação: ${error}`);
            }
        } finally { }
    }

    useEffect(() => {
        if (initialValues) {
            setFormData({
                id: initialValues.id,
                name: initialValues.name,
                document: initialValues.document.replace(/\D/g, "").slice(0, 14),
                description: initialValues.description ?? "",
            });
        } else {
            setFormData({
                name: "",
                document: "",
                description: "",
            });
        }
    }, [ initialValues ]);

    return (
        <Styled.Form id="company-form" onSubmit={ handleSubmit }>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="name"> Nome </Styled.Label>

                <Styled.Input id="name" name="name" placeholder="Digite o nome da empresa" value={ formData.name } onChange={ handleChange } />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="document"> CNPJ </Styled.Label>

                <Styled.Input id="document" name="document" placeholder="Digite o cnpj da empresa" value={ formatCompanyDocument(formData.document) } onChange={ handleChange } />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="description"> Descrição </Styled.Label>

                <Styled.Input id="description" name="description" placeholder="Digite uma descrição para a empresa" value={ formData.description } onChange={ handleChange } />
            </Styled.FieldWrapper>
        </Styled.Form>
    );
}
