import { toast } from 'react-toastify';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import * as S from '../../../shared/components/table/styles/table.style';

import { TemplateForm } from '../forms/templateForm.form';
import { Rank, List, Delete } from '../services/template.service';
import { TemplateResponseDto } from '../dtos/templateResponse.dto';
import { formatDate } from '../../../shared/utils/formatDate.util';
import { Modal } from '../../../shared/components/modal/screens/Modal';
import { Table } from '../../../shared/components/table/screens/Table';
import { TemplateFormData } from '../schemas/templateFormSchema.schema';
import { Finder } from '../../../shared/components/finder/screen/Finder';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import { Paginate } from '../../../shared/components/paginate/screens/Paginate';
import { EmptyState } from '../../../shared/components/emptyState/screens/EmpyState';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { DashboardRankingChart } from '../../../shared/components/dashboardChart/screens/DashboardRankingChart';

export const Template = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [templates, setTemplates] = useState<TemplateResponseDto[]>([]);
    const [updating, setUpdating] = useState<TemplateFormData | null>(null);
    const [isRankingLoading, setIsRankingLoading] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [templatesRanking, setTemplatesRanking] = useState<{ name: string; value: number }[]>([]);

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
    const handleTemplatesRanking = useCallback(async () => {
        try {
            setIsRankingLoading(true);

            const response = await Rank();
            const rankingData = response.map((item) => ({
                name: item.templateName,
                value: item.totalBatches,
            }));

            setTemplatesRanking(rankingData);
        } catch (error) {
            toast.error(`Erro ao carregar o dashboard para Templates: ${ error }`);
        } finally {
            setIsRankingLoading(false);
        }
    }, []);
    const handleRead = useCallback(async () => {
        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search, };
            const response = await List(params);

            setTemplates(response.data);
            setTotal(response.total);
        } catch (error) {
            toast.error(`Erro ao listar Templates: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search, ])
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
        handleTemplatesRanking();
    }, [ handleTemplatesRanking, ]);
    useEffect(() => {
        const timeout = setTimeout(() => {
            handleRead();
        }, 500);

        return () => clearTimeout(timeout);
    }, [ handleRead, ]);

    return (
        <Fragment>
            { isLoading && (
                <LoadingState/>
            ) }
            { !isLoading && (
                <Finder showAddButton={ true } placeholder="Pesquise um template por nome" buttonText="Cadastrar" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } }/>
            ) }
            { !isLoading && templates.length > 0 && (
                <Fragment>
                    { !isRankingLoading && templatesRanking.length > 0 && (
                        <DashboardRankingChart
                            counterData={ total }
                            graphicData={ templatesRanking }
                            graphicConfig={{ entitySingular: "Template", entityPlural: "Templates", subEntityPlural: "Lotes", }}
                        />
                    ) }

                    <Table<TemplateResponseDto>
                        headers={[ "Nome", "Atualização", ]}
                        data={ templates }
                        getEntityId={ (template: TemplateResponseDto) => template.id }
                        onEdit={ handleUpdate }
                        onDelete={ (id: number) => { setSelectedTemplateId(id); setIsDeleteModalOpen(true); } }
                        renderEntityRow={ (template: TemplateResponseDto) => (
                            <Fragment>
                                <S.TableListBodyRowData> <S.UniqueKeyDestak> { template.name } </S.UniqueKeyDestak> </S.TableListBodyRowData>
                                <S.TableListBodyRowData> <S.TimeStampDestak> { formatDate(template.updatedAt, false) } </S.TimeStampDestak> </S.TableListBodyRowData>
                            </Fragment>
                        ) }
                        canEdit={ true }
                        canDelete={ true }
                    />

                    <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } }/>
                </Fragment>
            ) }
            { !isLoading && templates.length === 0 && (
                <EmptyState message="Nenhum template encontrado"/>
            ) }

            <Modal isOpen={ isDeleteModalOpen } entityName={ templates.find((template: TemplateResponseDto) => template.id === selectedTemplateId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleDelete }/>

            <Drawer isOpen={ isDrawerOpen } isSubmitting={ isSubmitting } formId="template-form" title={ updating ? "Editar template" : "Novo template" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <TemplateForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); if (isSubmitting) { return; } setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleRead(); } } onLoadingChange={ setIsSubmitting }/>
            </Drawer>
        </Fragment>
    );
}
