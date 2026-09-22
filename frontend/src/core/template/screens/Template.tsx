import { toast } from 'react-toastify';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { TemplateForm } from '../forms/templateForm.form';
import { List, Delete } from '../services/template.service';
import { TemplateResponseDto } from '../dtos/templateResponse.dto';
import Modal from '../../../shared/components/modal/screens/Modal';
import { formatDate } from '../../../shared/utils/formatDate.util';
import { Table } from '../../../shared/components/table/screens/Table';
import { TemplateFormData } from '../schemas/templateFormSchema.schema';
import { Finder } from '../../../shared/components/finder/screen/Finder';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import * as Styled from '../../../shared/components/table/styles/table.style';
import { EmptyState } from '../../../shared/components/emptyState/screens/EmpyState';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

const Template = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [templates, setTemplates] = useState<TemplateResponseDto[]>([]);
    const [updating, setUpdating] = useState<TemplateFormData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

    const { userInformation } = getAuthenticationStorage();

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
    const handleRead = useCallback(async () => {
        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search };
            const response = await List(params);

            setTemplates(response.data);
            setTotal(response.total);
        } catch (error) {
            toast.error(`Erro ao listar Templates: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search ]);
    const handleUpdate = (id: number) => {
        const clicked = templates.find((template: TemplateResponseDto) => template.id === id);

        if (!clicked) {
            return;
        }

        setUpdating({
            id: clicked.id,
            companyId: clicked.companyId,
            name: clicked.name,
            content: clicked.content,
        });
        setIsDrawerOpen(true);
    }
    const handleDelete = async () => {
        if (selectedTemplateId === null) {
            return;
        }

        try {
            await Delete({ id: selectedTemplateId });

            setIsDeleteModalOpen(false);
            setSelectedTemplateId(null);

            if (templates.length === 1 && page > 1) {
                setPage((previousPage: number) => previousPage - 1);
            } else {
                await handleRead();
            }

            toast.success("Template excluído com suceso");
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
                <Finder showAddButton={ userInformation?.isSystemRoot ?? false } placeholder="Pesquise um template por nome" buttonText="Cadastrar template" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } } />
            ) }
            { !isLoading && templates.length > 0 && (
                <Fragment>
                    <Table<TemplateResponseDto>
                        headers={[ "Nome", "Criado em", "Editado em", ]}
                        data={ templates }
                        getEntityId={ (template: TemplateResponseDto) => template.id }
                        onEdit={ userInformation?.isSystemRoot ? handleUpdate : undefined }
                        onDelete={ userInformation?.isSystemRoot ? (id: number) => { setSelectedTemplateId(id); setIsDeleteModalOpen(true); } : undefined }
                        renderEntityRow={ (template: TemplateResponseDto) => (
                            <Fragment>
                                <Styled.TableListBodyRowData> <b> { template.name } </b> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(template.createdAt, true) } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(template.updatedAt, true) } </Styled.TableListBodyRowData>
                            </Fragment>
                        ) }
                    />

                    <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } } />
                </Fragment>
            ) }
            { !isLoading && templates.length === 0 && (
                <EmptyState message="Nenhum template encontrado" />
            ) }

            <Modal isOpen={ isDeleteModalOpen } entityName={ templates.find((template: TemplateResponseDto) => template.id === selectedTemplateId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleDelete } />

            <Drawer isOpen={ isDrawerOpen } isSubmitting={ isSubmitting } formId="template-form" title={ updating ? "Editar template" : "Novo template" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <TemplateForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); if (isSubmitting) { return; } setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleRead(); } } onLoadingChange={ setIsSubmitting } />
            </Drawer>
        </Fragment>
    );
}

export default Template;
