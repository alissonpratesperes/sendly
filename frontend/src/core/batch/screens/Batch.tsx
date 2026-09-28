import { toast } from 'react-toastify';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { BatchForm } from '../forms/batchForm.form';
import { List, Delete } from '../services/batch.service';
import { BatchResponseDto } from '../dtos/batchResponse.dto';
import { BatchFormData } from '../schemas/batchFormSchema.schema';
import { formatDate } from '../../../shared/utils/formatDate.util';
import Modal from '../../../shared/components/modal/screens/Modal';
import { ListResponseDto } from '../../list/dtos/listResponse.dto';
import { Read as ReadList } from '../../list/services/list.service';
import { Table } from '../../../shared/components/table/screens/Table';
import { Finder } from '../../../shared/components/finder/screen/Finder';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import * as Styled from '../../../shared/components/table/styles/table.style';
import { TemplateResponseDto } from '../../template/dtos/templateResponse.dto';
import { Read as ReadTemplate } from '../../template/services/template.service';
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
    const [listsNames, setListsNames] = useState<Record<number, ListResponseDto>>({});
    const [templatesNames, setTemplatesNames] = useState<Record<number, TemplateResponseDto>>({});

    const listsNamesRef = useRef<Record<number, ListResponseDto>>({});
    const templatesNamesRef = useRef<Record<number, TemplateResponseDto>>({});

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
    const handleRead = useCallback(async () => {
        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search };
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
            toast.error(`Erro ao listar Envios: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search ])
    const handleUpdate = (id: number) => {
        const clicked = batches.find((batch: BatchResponseDto) => batch.id === id);

        if (!clicked) {
            return;
        }

        setUpdating({
            id: clicked.id,
            companyId: clicked.companyId,
            name: clicked.name,
            templateId: clicked.templateId,
            listId: clicked.listId,
        });
        setIsDrawerOpen(true);
    }
    const handleDelete = async () => {
        if (selectedBatchId === null) {
            return;
        }

        try {
            await Delete({ id: selectedBatchId });

            setIsDeleteModalOpen(false);
            setSelectedBatchId(null);

            if (batches.length === 1 && page > 1) {
                setPage((previousPage: number) => previousPage - 1);
            } else {
                await handleRead();
            }

            toast.success("Envio excluído com suceso");
        } catch (error: unknown) {
            toast.error("Não é possível prosseguir com a solicitação");
        } finally { }
    }

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
                <Finder showAddButton={ true } placeholder="Pesquise um lote por nome" buttonText="Cadastrar lote" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } }/>
            ) }
            { !isLoading && batches.length > 0 && (
                <Fragment>
                    <Table<BatchResponseDto>
                        headers={[ "Nome", "Template", "Iniciado em", "Finalizado em", "Status", "Criado em", "Editado em", ]}
                        data={ batches }
                        getEntityId={ (batch: BatchResponseDto) => batch.id }
                        onEdit={ handleUpdate }
                        onDelete={ (id: number) => { setSelectedBatchId(id); setIsDeleteModalOpen(true); } }
                        renderEntityRow={ (batch: BatchResponseDto) => (
                            <Fragment>
                                <Styled.TableListBodyRowData> <Styled.TableListColorContent> <Styled.TableListColorFragment $color={ listsNames[batch.listId]?.color ?? "" }/> <Styled.ContactNameSpan> <b> { batch.name } </b> </Styled.ContactNameSpan> </Styled.TableListColorContent> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { templatesNames[batch.templateId]?.name ?? "" } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { batch.startedAt ? formatDate(batch.startedAt, true) : "" } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { batch.endedAt ? formatDate(batch.endedAt, true) : "" } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <StatusBadge variant={ batch.status }/> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(batch.createdAt, true) } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(batch.updatedAt, true) } </Styled.TableListBodyRowData>
                            </Fragment>
                        ) }
                    />

                    <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } }/>
                </Fragment>
            ) }
            { !isLoading && batches.length === 0 && (
                <EmptyState message="Nenhum envio encontrado" />
            ) }

            <Modal isOpen={ isDeleteModalOpen } entityName={ batches.find((batch: BatchResponseDto) => batch.id === selectedBatchId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleDelete }/>

            <Drawer isOpen={ isDrawerOpen } isSubmitting={ isSubmitting } formId="batch-form" title={ updating ? "Editar lote" : "Novo lote" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <BatchForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); if (isSubmitting) { return; } setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleRead(); } } onLoadingChange={ setIsSubmitting }/>
            </Drawer>
        </Fragment>
    );
}

export default Batch;