import * as z from 'zod';
import Select from 'react-select';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import { Create, Update } from '../services/User.service';
import { Read } from '../../regional/services/Regional.service';
import { UserFormData } from '../schemas/UserFormSchema.schema';
import { UserFormSchema } from '../schemas/UserFormSchema.schema';
import { RegionalDTO } from '../../regional/dtos/RegionalDTO.dto';
import Toast from '../../../shared/components/toast/screens/Toast';
import { UserFormProps } from '../interfaces/UserFormProps.interface';
import * as RegistrationSharedStyled from '../../../shared/styles/Registration.style';
import * as Styled from '../../../shared/components/drawer/styles/GenericDrawer.style';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';

export const UserForm: React.FC<UserFormProps> = ({ initialValues, onSubmit, onCancel }) => {
    const [regionals, setRegionals] = useState<RegionalDTO[]>([]);
    const statusOptions = [{ value: true, label: 'Ativo' }, { value: false, label: 'Inativo' }];
    const administratorOptions = [{ value: true, label: 'Sim' }, { value: false, label: 'Não' }];
    const [formData, setFormData] = useState<UserFormData>({
        id: undefined,
        nome: "",
        regionalId: 0,
        email: "",
        senha: "",
        isAdministrador: false,
        ativo: true
    });

    const optionsForRegionals = regionals.filter(item => String(item.ativo).toLowerCase() === 'true').map(item => ({ value: Number(item.id), label: item.nome }));

    const { showLoading, hideLoading } = useLoading();

    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        try {
            showLoading();

            const isCreatingNewUser = !initialValues?.id;
            const validatedFormData = UserFormSchema.parse(formData);

            if (isCreatingNewUser && (!validatedFormData.senha || validatedFormData.senha.trim() === "")) {
                throw new z.ZodError([{ path: ['senha'], message: 'A senha é obrigatória', code: z.ZodIssueCode.custom }]);
            };
            if (isCreatingNewUser) {
                await Create(validatedFormData);
            } else {
                await Update(initialValues.id!, validatedFormData);
            };

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
        const fetchRegionals = async () => {
            try {
                const params: PaginatedRequestDTO = { page: 1, pageSize: 1000, sortBy: 'id', sortDir: 'desc', search: '' };
                const response = await Read(params);

                setRegionals(response.items);
            } catch (error) {
                toast.error(`Erro ao listar as opções de Regionais: ${error}`);
            };
        };

        fetchRegionals();
    }, []);
    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
        };
    }, [initialValues]);

    return (
        <Styled.Form onSubmit={handleSubmit}>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="nome"> Nome do usuário </Styled.Label>

                <Styled.Input id="nome" name="nome" placeholder="Digite o nome do usuário" value={formData.nome} onChange={handleChange} />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="email"> Email </Styled.Label>

                <Styled.Input id="email" name="email" placeholder="Digite o email do usuário" value={formData.email} onChange={handleChange} />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="senha"> Senha </Styled.Label>

                <Styled.Input id="senha" name="senha" placeholder="Digite a senha" value={formData.senha} onChange={handleChange} />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="regionalId"> Regional </Styled.Label>

                <Select
                    isClearable
                    inputId="regionalId"
                    options={optionsForRegionals}
                    placeholder="Selecione uma regional"
                    components={{ IndicatorSeparator: () => null }}
                    styles={RegistrationSharedStyled.SelectCommonStyles}
                    value={optionsForRegionals.find(option => option.value === formData.regionalId)}
                    onChange={(selectedOption) => setFormData(prev => ({ ...prev, regionalId: selectedOption ? selectedOption.value : 0 }))}
                />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="isAdministrador"> Administrador </Styled.Label>

                <Select
                    inputId="isAdministrador"
                    options={administratorOptions}
                    components={{ IndicatorSeparator: () => null }}
                    styles={RegistrationSharedStyled.SelectCommonStyles}
                    value={administratorOptions.find(option => option.value === formData.isAdministrador) || null}
                    onChange={(option) => setFormData(prev => ({ ...prev, isAdministrador: option?.value || false }))}
                />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="ativo"> Status </Styled.Label>

                <Select
                    inputId="ativo"
                    options={statusOptions}
                    components={{ IndicatorSeparator: () => null }}
                    styles={RegistrationSharedStyled.SelectCommonStyles}
                    value={statusOptions.find(option => option.value === formData.ativo) || null}
                    onChange={(option) => setFormData(prev => ({ ...prev, ativo: option?.value || false }))}
                />
            </Styled.FieldWrapper>

            <Styled.Footer>
                <Styled.FooterButton type="button" $variant="secondary" onClick={onCancel}> Cancelar </Styled.FooterButton>
                <Styled.FooterButton type="submit" $variant="primary"> {initialValues?.id ? 'Atualizar usuário' : 'Cadastrar usuário'} </Styled.FooterButton>
            </Styled.Footer>
        </Styled.Form>
    );
};