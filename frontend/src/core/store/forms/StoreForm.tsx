import * as z from 'zod';
import Select from 'react-select';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import { ChainDTO } from '../../chain/dtos/ChainDTO.dto';
import { Read } from '../../chain/services/Chain.service';
import { Create, Update } from '../services/Store.service';
import { StoreFormData } from '../schemas/StoreFormSchema.schema';
import Toast from '../../../shared/components/toast/screens/Toast';
import { StoreFormSchema } from '../schemas/StoreFormSchema.schema';
import { StoreFormProps } from '../interfaces/StoreFormProps.interface';
import { cnpjFormatterUtil } from '../../../shared/utils/cnpjFormatterUtil.util';
import * as RegistrationSharedStyled from '../../../shared/styles/Registration.style';
import * as Styled from '../../../shared/components/drawer/styles/drawer.style';

export const StoreForm: React.FC<StoreFormProps> = ({ initialValues, onSubmit, onCancel }) => {
    const [chains, setChains] = useState<ChainDTO[]>([]);
    const statusOptions = [{ value: true, label: 'Ativo' }, { value: false, label: 'Inativo' }];
    const optionsForChains = chains.filter(chain => chain.id !== undefined && chain.id !== null && chain.ativo).map(chain => ({ value: Number(chain.id), label: chain.nome })).sort((a, b) => a.label.localeCompare(b.label));
    const [formData, setFormData] = useState<StoreFormData>({ id: undefined, codigo: "", razaoSocial: "", apelido: "", cnpj: "", redeId: 0, endereco: "", bairro: "", ativo: true });



    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        try {

            const validatedFormData = StoreFormSchema.parse(formData);

            initialValues?.id ? await Update(initialValues.id, validatedFormData) : await Create(validatedFormData);

            onSubmit();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error(<Toast errors={error.issues} />);
            } else {
                console.error(error);
            };
        } finally {
        };
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'cnpj') {
            const cleanedValue = value.replace(/\D/g, '').slice(0, 14);

            setFormData(prev => ({ ...prev, [name]: cleanedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        };
    };

    useEffect(() => {
        const fetchChains = async () => {
            try {
                const fetchAllChains = async () => {
                    let page = 1;
                    let totalPages = 1;
                    let allChains: ChainDTO[] = [];

                    do {
                        const response = await Read({ page, pageSize: 100, sortBy: 'id', sortDir: 'desc', search: '' });

                        allChains = [...allChains, ...response.items];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setChains(allChains);
                };

                await fetchAllChains();
            } catch (error) {
                toast.error(`Erro ao listar as opções de Rede: ${error}`);
            };
        };

        fetchChains();
    }, []);
    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
        };
    }, [initialValues]);

    return (
        <Styled.Form onSubmit={handleSubmit}>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="codigo"> Código </Styled.Label>

                <Styled.Input id="codigo" name="codigo" placeholder="Digite o código da loja" value={formData.codigo} onChange={handleChange} />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="razaoSocial"> Razão Social </Styled.Label>

                <Styled.Input id="razaoSocial" name="razaoSocial" placeholder="Digite a razão social da loja" value={formData.razaoSocial} onChange={handleChange} />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="apelido"> Apelido loja </Styled.Label>

                <Styled.Input id="apelido" name="apelido" placeholder="Digite o apelido da loja" value={formData.apelido} onChange={handleChange} />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="cnpj"> CNPJ </Styled.Label>

                <Styled.Input id="cnpj" name="cnpj" placeholder="Digite o CNPJ" value={cnpjFormatterUtil(formData.cnpj)} onChange={handleChange} />
            </Styled.FieldWrapper>

            <Styled.FieldWrapper>
                <Styled.Label htmlFor="redeId"> Rede vinculada </Styled.Label>

                <Select
                    isClearable
                    inputId="redeId"
                    options={optionsForChains}
                    placeholder="Selecione uma rede"
                    components={{ IndicatorSeparator: () => null }}
                    styles={RegistrationSharedStyled.SelectCommonStyles}
                    value={optionsForChains.find(option => option.value === formData.redeId)}
                    onChange={(selectedOption) => setFormData(prev => ({ ...prev, redeId: selectedOption ? selectedOption.value : 0 }))}
                />
            </Styled.FieldWrapper>

            <Styled.FieldWrapper>
                <Styled.Label htmlFor="endereco"> Endereço </Styled.Label>

                <Styled.Input id="endereco" name="endereco" placeholder="Digite o endereço" value={formData.endereco} onChange={handleChange} />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="bairro"> Bairro </Styled.Label>

                <Styled.Input id="bairro" name="bairro" placeholder="Digite o bairro" value={formData.bairro} onChange={handleChange} />
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
                <Styled.FooterButton type="submit" $variant="primary"> {initialValues?.id ? 'Atualizar loja' : 'Cadastrar loja'} </Styled.FooterButton>
            </Styled.Footer>
        </Styled.Form>
    );
};