import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import * as G from '../../../shared/styles/global.style';
import * as S from '../../../shared/components/drawer/styles/drawer.style';
import * as F from '../../../shared/components/dropdown/styles/contactFormDropdown.style';

import { Create } from '../services/batch.service';
import { ListResponseDto } from '../../list/dtos/listResponse.dto';
import { List as ListLists } from '../../list/services/list.service';
import { Toast } from '../../../shared/components/toast/screens/Toast';
import { CreateBatchCommandDto } from '../dtos/createBatchCommand.dto';
import { FormProps } from '../../../shared/interfaces/formProps.interface';
import { TemplateResponseDto } from '../../template/dtos/templateResponse.dto';
import { Dropdown } from '../../../shared/components/dropdown/screens/Dropdown';
import { List as ListTemplates } from '../../template/services/template.service';
import { BatchFormData, BatchFormSchema } from '../schemas/batchFormSchema.schema';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';

export const BatchForm: React.FC<FormProps<BatchFormData>> = ({ initialValues, onSubmit, onLoadingChange, }) => {
    const { userInformation } = getAuthenticationStorage();

    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [lists, setLists] = useState<ListResponseDto[]>([]);
    const [isListsLoading, setIsListsLoading] = useState<boolean>(false);
    const [templates, setTemplates] = useState<TemplateResponseDto[]>([]);
    const [isTemplatesLoading, setIsTemplatesLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<BatchFormData>({ companyId: 0, name: "", templateId: 0, listId: 0, });

    const optionsForLists = lists
        .filter((list: ListResponseDto) => list.id !== undefined && list.id !== null)
        .map((list: ListResponseDto) => ({
            value: Number(list.id),
            label: list.name,
            color: list.color,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    const optionsForTemplates = templates
        .filter((template: TemplateResponseDto) => template.id !== undefined && template.id !== null)
        .map((template: TemplateResponseDto) => ({
            value: Number(template.id),
            label: template.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = changeEvent.target;

        setFormData((previous: BatchFormData) => ({
            ...previous,

            [name]: value,
        }));
    }
    const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

        onLoadingChange(true);

        try {
            const validatedFormData = BatchFormSchema.parse(formData);

            if (initialValues?.id === undefined) {
                const command: CreateBatchCommandDto = {
                    companyId: userInformation?.company.id ?? 0,
                    name: validatedFormData.name,
                    templateId: validatedFormData.templateId,
                    listId: validatedFormData.listId,
                }

                await Create(command);

                toast.success("Envio criado com sucesso");
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
        const progressiveTemplatesFetch = async () => {
            try {
                setIsTemplatesLoading(true);

                const fetchAllTemplates = async () => {
                    let page = 1;
                    let totalPages = 0;
                    let allFetchedTemplates: TemplateResponseDto[] = [];

                    do {
                        const response = await ListTemplates({ page, limit, search, });

                        allFetchedTemplates = [ ...allFetchedTemplates, ...response.data ];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setTemplates(allFetchedTemplates);
                };

                await fetchAllTemplates();
            } catch (error) {
                toast.error(`Erro ao listar as opções de Templates: ${ error }`);
            } finally {
                setIsTemplatesLoading(false);
            }
        };
        const progressiveListsFetch = async () => {
            try {
                setIsListsLoading(true);

                const fetchAllLists = async () => {
                    let page = 1;
                    let totalPages = 0;
                    let allFetchedLists: ListResponseDto[] = [];

                    do {
                        const companyId = initialValues?.companyId ?? userInformation?.company.id;
                        const response = await ListLists({ page, limit, search, companyId, });

                        allFetchedLists = [ ...allFetchedLists, ...response.data ];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setLists(allFetchedLists);
                };

                await fetchAllLists();
            } catch (error) {
                toast.error(`Erro ao listar as opções de Listas: ${ error }`);
            } finally {
                setIsListsLoading(false);
            }
        };

        progressiveTemplatesFetch();
        progressiveListsFetch();
    }, []);
    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
        } else {
            setFormData({ ...formData, });
        }
    }, [ initialValues, ]);

    return (
        <S.Form id="batch-form" onSubmit={ handleSubmit }>
            <S.FieldWrapper>
                <G.Label htmlFor="name"> Nome </G.Label>

                <G.Input id="name" name="name" placeholder="Digite o nome do envio" value={ formData.name } onChange={ handleChange }/>
            </S.FieldWrapper>
            <S.FieldWrapper>
                <Dropdown
                    inputId="templateId"
                    isLoading={ isTemplatesLoading }
                    options={ optionsForTemplates }
                    placeholder="Vincule a um template"
                    value={ optionsForTemplates.find((option) => option.value === formData.templateId) ?? null }
                    onChange={ (selectedOption) => setFormData((previous) => ({ ...previous, templateId: selectedOption?.value ?? 0 })) }
                />
            </S.FieldWrapper>
            <S.FieldWrapper>
                <Dropdown
                    inputId="listId"
                    isLoading={ isListsLoading }
                    options={ optionsForLists }
                    placeholder="Vincule a uma lista"
                    value={ optionsForLists.find((option) => option.value === formData.listId) ?? null }
                    onChange={ (selectedOption) => setFormData((previous) => ({ ...previous, listId: selectedOption?.value ?? 0 })) }

                    formatOptionLabel={ (option) => (
                        <F.OptionContent>
                            <F.ListColor $color={ option.color }/>

                            <span> { option.label } </span>
                        </F.OptionContent>
                    ) }
                />
            </S.FieldWrapper>
        </S.Form>
    );
}
