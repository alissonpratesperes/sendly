import { toast } from 'react-toastify';
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { List } from '../services/batch.service';
import { BatchForm } from '../forms/batchForm.form';
import { BatchResponseDto } from '../dtos/batchResponse.dto';
import { BatchFormData } from '../schemas/batchFormSchema.schema';
import { formatDate } from '../../../shared/utils/formatDate.util';
import { ListResponseDto } from '../../list/dtos/listResponse.dto';
import { Read as ReadList } from '../../list/services/list.service';
import { Table } from '../../../shared/components/table/screens/Table';
import { Finder } from '../../../shared/components/finder/screen/Finder';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import Dropdown from '../../../shared/components/dropdown/screens/Dropdown';
import * as Styled from '../../../shared/components/table/styles/table.style';
import { TemplateResponseDto } from '../../template/dtos/templateResponse.dto';
import { Read as ReadTemplate } from '../../template/services/template.service';
import { List as ListTemplates } from '../../template/services/template.service';
import { EmptyState } from '../../../shared/components/emptyState/screens/EmpyState';
import StatusBadge from '../../../shared/components/statusBadge/screens/StatusBadge';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

const Batch = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [batches, setBatches] = useState<BatchResponseDto[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [updating, setUpdating] = useState<BatchFormData | null>(null);
    const [templates, setTemplates] = useState<TemplateResponseDto[]>([]);
    const [isTemplatesLoading, setIsTemplatesLoading] = useState<boolean>(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [listsNames, setListsNames] = useState<Record<number, ListResponseDto>>({});
    const [templatesNames, setTemplatesNames] = useState<Record<number, TemplateResponseDto>>({});

    const listsNamesRef = useRef<Record<number, ListResponseDto>>({});
    const templatesNamesRef = useRef<Record<number, TemplateResponseDto>>({});

    const optionsForTemplates = useMemo(() => {
        return templates
            .filter((template) => template.id !== undefined && template.id !== null)
            .map((template) => ({ value: Number(template.id), label: template.name, }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [ templates ]);
    const selectedTemplateOption = useMemo(() => {
        return optionsForTemplates.find((option) => option.value === selectedTemplateId) ?? null;
    }, [ optionsForTemplates, selectedTemplateId ]);

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
    const handleRead = useCallback(async () => {
        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search, templateId: selectedTemplateId ?? undefined, };
            const response = await List(params);

            setBatches(response.data);
            setTotal(response.total);

            const uniqueListsIds = Array.from(new Set(response.data.map((list: BatchResponseDto) => list.listId)));
            const missingListsIds = uniqueListsIds.filter((id: number) => !listsNamesRef.current[id]);
            const uniqueTemplatesIds = Array.from(new Set(response.data.map((template: BatchResponseDto) => template.templateId)));
            const missingTemplatesIds = uniqueTemplatesIds.filter((id: number) => !templatesNamesRef.current[id]);

            if (missingListsIds.length > 0) {
                const responses = await Promise.all(
                    missingListsIds.map(async (id: number) => {
                        try {
                            return await ReadList({ id });
                        } catch {
                            return null;
                        }
                    })
                );

                const newLists: Record<number, ListResponseDto> = {};

                responses.forEach((list) => {
                    if (list) {
                        newLists[list.id] = list;
                    }
                });

                setListsNames((previousListsNames: Record<number, ListResponseDto>) => ({ ...previousListsNames, ...newLists, }));
            }
            if (missingTemplatesIds.length > 0) {
                const responses = await Promise.all(
                    missingTemplatesIds.map(async (id: number) => {
                        try {
                            return await ReadTemplate({ id });
                        } catch {
                            return null;
                        }
                    })
                );

                const newTemplates: Record<number, TemplateResponseDto> = {};

                responses.forEach((list) => {
                    if (list) {
                        newTemplates[list.id] = list;
                    }
                });

                setTemplatesNames((previousTemplatesNames: Record<number, TemplateResponseDto>) => ({ ...previousTemplatesNames, ...newTemplates, }));
            }
        } catch (error) {
            toast.error(`Erro ao listar Lotes: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search, selectedTemplateId ])

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
                }

                await fetchAllTemplates();
            } catch (error) {
                toast.error(`Erro ao listar as opções de Templates: ${ error }`);
            } finally {
                setIsTemplatesLoading(false);
            }
        }

        progressiveTemplatesFetch();
    }, []);
    useEffect(() => {
        const timeout = setTimeout(() => {
            handleRead();
        }, 500);

        return () => clearTimeout(timeout);
    }, [ handleRead ]);

    return (
        <Fragment>
            { isLoading && (
                <LoadingState/>
            ) }
            { !isLoading && (
                <Styled.WhenInMultiSearchContainer>
                    <Styled.WhenInAnotherScreenWrapper>
                        <Dropdown
                            inputId="templateId"
                            isInBatchSendScreen={ true }
                            isLoading={ isTemplatesLoading }
                            isSearchable={ true }
                            isClearable={ true }
                            options={ optionsForTemplates }
                            placeholder="Filtre por um template"
                            value={ selectedTemplateOption }
                            onChange={ (selectedOption) => { setSelectedTemplateId(selectedOption?.value ?? null); setPage(1); } }
                        />
                    </Styled.WhenInAnotherScreenWrapper>

                    <Finder showAddButton={ true } placeholder="Pesquise um lote por nome" buttonText="Cadastrar lote" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } }/>
                </Styled.WhenInMultiSearchContainer>
            ) }
            { !isLoading && batches.length > 0 && (
                <Fragment>
                    <Table<BatchResponseDto>
                        headers={[ "Nome", "Template", "Iniciado em", "Finalizado em", "Status", "Criado em", "Editado em", ]}
                        data={ batches }
                        isInBatchScreen={ true }
                        getEntityId={ (batch: BatchResponseDto) => batch.id }
                        renderEntityRow={ (batch: BatchResponseDto) => (
                            <Fragment>
                                <Styled.TableListBodyRowData> <Styled.TableListColorContent> <Styled.TableListColorFragment $color={ listsNames[batch.listId]?.color ?? "" }/> <Styled.ContactNameSpan> <b> { batch.name } </b> </Styled.ContactNameSpan> </Styled.TableListColorContent> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { templatesNames[batch.templateId]?.name ?? "" } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { batch.startedAt ? formatDate(batch.startedAt, true) : "-" } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { batch.endedAt ? formatDate(batch.endedAt, true) : "-" } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <StatusBadge variant={ batch.status }/> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(batch.createdAt, true) } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(batch.updatedAt, true) } </Styled.TableListBodyRowData>
                            </Fragment>
                        ) }
                        canEdit={ false }
                        canDelete={ false }
                    />

                    <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } }/>
                </Fragment>
            ) }
            { !isLoading && batches.length === 0 && (
                <EmptyState message="Nenhum lote encontrado" />
            ) }

            <Drawer isOpen={ isDrawerOpen } isSubmitting={ isSubmitting } formId="batch-form" title={ updating ? "Editar lote" : "Novo lote" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <BatchForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); if (isSubmitting) { return; } setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleRead(); } } onLoadingChange={ setIsSubmitting }/>
            </Drawer>
        </Fragment>
    );
}

export default Batch;