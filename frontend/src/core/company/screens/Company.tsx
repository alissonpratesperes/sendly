import { toast } from 'react-toastify';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import * as S from '../../../shared/components/table/styles/table.style';

import { CompanyForm } from '../forms/companyForm.form';
import { Rank, List, Delete } from '../services/company.service';
import { CompanyResponseDto } from '../dtos/companyResponse.dto';
import { formatDate } from '../../../shared/utils/formatDate.util';
import { CompanyFormData } from '../schemas/companyFormSchema.schema';
import { Table } from '../../../shared/components/table/screens/Table';
import { Modal } from '../../../shared/components/modal/screens/Modal';
import { Finder } from '../../../shared/components/finder/screen/Finder';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import { Paginate } from '../../../shared/components/paginate/screens/Paginate';
import { EmptyState } from '../../../shared/components/emptyState/screens/EmpyState';
import { formatCompanyDocument } from '../../../shared/utils/formatCompanyDocument.util';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { DashboardRankingChart } from '../../../shared/components/dashboardChart/screens/DashboardRankingChart';

export const Company = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [companies, setCompanies] = useState<CompanyResponseDto[]>([]);
    const [updating, setUpdating] = useState<CompanyFormData | null>(null);
    const [isRankingLoading, setIsRankingLoading] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [usersRanking, setUsersRanking] = useState<{ name: string; value: number }[]>([]);

    const { userInformation } = getAuthenticationStorage();

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
    const handleUsersRanking = useCallback(async () => {
        try {
            setIsRankingLoading(true);

            const response = await Rank();
            const rankingData = response.map((item) => ({
                name: item.companyName,
                value: item.totalUsers,
            }));

            setUsersRanking(rankingData);
        } catch (error) {
            toast.error(`Erro ao carregar o dashboard para Empresas: ${ error }`);
        } finally {
            setIsRankingLoading(false);
        }
    }, []);
    const handleRead = useCallback(async () => {
        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search, };
            const response = await List(params);

            setCompanies(response.data);
            setTotal(response.total);
        } catch (error) {
            toast.error(`Erro ao listar Empresas: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search, ])
    const handleUpdate = (id: number) => {
        const clicked = companies.find((company: CompanyResponseDto) => company.id === id);

        if (!clicked) {
            return;
        }

        setUpdating({
            id: clicked.id,
            name: clicked.name,
            document: clicked.document,
            description: clicked.description ?? "",
        });
        setIsDrawerOpen(true);
    }
    const handleDelete = async () => {
        if (selectedCompanyId === null) {
            return;
        }

        try {
            await Delete({ id: selectedCompanyId });

            setIsDeleteModalOpen(false);
            setSelectedCompanyId(null);

            if (companies.length === 1 && page > 1) {
                setPage((previousPage: number) => previousPage - 1);
            } else {
                await handleRead();
            }

            toast.success("Empresa excluída com suceso");
        } catch (error: unknown) {
            toast.error("Não é possível prosseguir com a solicitação");
        } finally { }
    }

    useEffect(() => {
        handleUsersRanking();
    }, [ handleUsersRanking, ]);
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
                <Finder showAddButton={ userInformation?.isSystemRoot ?? false } placeholder="Pesquise uma empresa por nome ou cnpj" buttonText="Cadastrar" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } }/>
            ) }
            { !isLoading && companies.length > 0 && (
                <Fragment>
                    { !isRankingLoading && usersRanking.length > 0 && (
                        <DashboardRankingChart
                            counterData={ total }
                            graphicData={ usersRanking }
                            graphicConfig={{ entitySingular: "Empresa", entityPlural: "Empresas", subEntityPlural: "Usuários", }}
                        />
                    ) }

                    <Table<CompanyResponseDto>
                        headers={[ "Nome", "Documento", "Descrição", "Atualização", ]}
                        data={ companies }
                        getEntityId={ (company: CompanyResponseDto) => company.id }
                        onEdit={ userInformation?.isSystemRoot ? handleUpdate : undefined }
                        onDelete={ userInformation?.isSystemRoot ? (id: number) => { setSelectedCompanyId(id); setIsDeleteModalOpen(true); } : undefined }
                        renderEntityRow={ (company: CompanyResponseDto) => (
                            <Fragment>
                                <S.TableListBodyRowData> { company.name } </S.TableListBodyRowData>
                                <S.TableListBodyRowData> <S.UniqueKeyDestak> { formatCompanyDocument(company.document) } </S.UniqueKeyDestak> </S.TableListBodyRowData>
                                <S.TableListBodyRowData> { company.description } </S.TableListBodyRowData>
                                <S.TableListBodyRowData> <S.TimeStampDestak> { formatDate(company.updatedAt, false) } </S.TimeStampDestak> </S.TableListBodyRowData>
                            </Fragment>
                        ) }
                        canEdit={ true }
                        canDelete={ true }
                    />

                    <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } }/>
                </Fragment>
            ) }
            { !isLoading && companies.length === 0 && (
                <EmptyState message="Nenhuma empresa encontrada"/>
            ) }

            <Modal isOpen={ isDeleteModalOpen } entityName={ companies.find((company: CompanyResponseDto) => company.id === selectedCompanyId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleDelete }/>

            <Drawer isOpen={ isDrawerOpen } isSubmitting={ isSubmitting } formId="company-form" title={ updating ? "Editar empresa" : "Nova empresa" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <CompanyForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); if (isSubmitting) { return; } setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleRead(); } } onLoadingChange={ setIsSubmitting }/>
            </Drawer>
        </Fragment>
    );
};
