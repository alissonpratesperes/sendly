import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import { Create, Update } from '../services/user.service';
import { List } from '../../company/services/company.service';
import Toast from '../../../shared/components/toast/screens/Toast';
import { CreateUserCommandDto } from '../dtos/createUserCommand.dto';
import { UpdateUserCommandDto } from '../dtos/updateUserCommand.dto';
import { FormProps } from '../../../shared/interfaces/formProps.interface';
import { CompanyResponseDto } from '../../company/dtos/companyResponse.dto';
import Dropdown from '../../../shared/components/dropdown/screens/Dropdown';
import { UserFormData, UserFormSchema } from '../schemas/userFormSchema.schema';
import * as Styled from '../../../shared/components/drawer/styles/drawer.style';

export const UserForm: React.FC<FormProps<UserFormData>> = ({ initialValues, onSubmit, onLoadingChange, }) => {
    const [companies, setCompanies] = useState<CompanyResponseDto[]>([]);
    const [isCompaniesLoading, setIsCompaniesLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserFormData>({ companyId: 0, name: "", email: "", });

    const optionsForCompanies = companies
        .filter((company: CompanyResponseDto) => company.id !== undefined && company.id !== null)
        .map((company: CompanyResponseDto) => ({
            value: Number(company.id),
            label: company.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = changeEvent.target;

        setFormData((previous: UserFormData) => ({
            ...previous,

            [name]: value,
        }));
    }
    const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

        onLoadingChange(true);

        try {
            const validatedFormData = UserFormSchema.parse(formData);

            if (initialValues?.id === undefined) {
                const command: CreateUserCommandDto = {
                    companyId: validatedFormData.companyId,
                    name: validatedFormData.name,
                    email: validatedFormData.email,
                }

                await Create(command);

                toast.success("Usuário criado com sucesso");
            } else {
                const command: UpdateUserCommandDto = {
                    companyId: validatedFormData.companyId,
                    name: validatedFormData.name,
                    email: validatedFormData.email,
                }

                await Update({ id: initialValues.id }, command);

                toast.success("Usuário editado com sucesso");
            }

            onSubmit();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error(<Toast errors={ error.issues } />);
            } else {
                toast.error("Não é possível prosseguir com a solicitação");
            }
        } finally {
            onLoadingChange(false);
        }
    }

    useEffect(() => {
        const progressiveCompaniesFetch = async () => {
            try {
                setIsCompaniesLoading(true);

                const fetchAllCompanies = async () => {
                    let page = 1;
                    let totalPages = 0;
                    let allFetchedCompanies: CompanyResponseDto[] = [];

                    do {
                        const response = await List({ page, limit: 30, search: "" });

                        allFetchedCompanies = [ ...allFetchedCompanies, ...response.data ];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setCompanies(allFetchedCompanies);
                };

                await fetchAllCompanies();
            } catch (error) {
                toast.error(`Erro ao listar as opções de Listas: ${error}`);
            } finally {
                setIsCompaniesLoading(false);
            }
        };

        progressiveCompaniesFetch();
    }, []);
    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
        } else {
            setFormData({ companyId: 0, name: "", email: "", });
        }
    }, [ initialValues ]);

    return (
        <Styled.Form id="user-form" onSubmit={ handleSubmit }>
            <Styled.FieldWrapper>
                <Dropdown
                    inputId="companyId"
                    isLoading={ isCompaniesLoading }
                    options={ optionsForCompanies }
                    placeholder="Vincule a uma empresa"
                    value={ optionsForCompanies.find((option) => option.value === formData.companyId) ?? null }
                    onChange={ (selectedOption) => setFormData((previous) => ({ ...previous, companyId: selectedOption?.value ?? 0 })) }
                />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="name"> Nome </Styled.Label>

                <Styled.Input id="name" name="name" placeholder="Digite o nome do usuário" value={ formData.name } onChange={ handleChange } />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="email"> Email </Styled.Label>

                <Styled.Input id="email" name="email" placeholder="Digite o e-mail do usuário" value={ formData.email } onChange={ handleChange } />
            </Styled.FieldWrapper>
        </Styled.Form>
    );
}
