import { toast } from 'react-toastify';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { CompanyForm } from '../forms/companyForm.form';
import { List, Delete } from '../services/company.service';
import { CompanyResponseDto } from '../dtos/companyResponse.dto';
import { formatDate } from '../../../shared/utils/formatDate.util';
import Modal from '../../../shared/components/modal/screens/Modal';
import { CompanyFormData } from '../schemas/companyFormSchema.schema';
import { Table } from '../../../shared/components/table/screens/Table';
import { Finder } from '../../../shared/components/finder/screen/Finder';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import * as Styled from '../../../shared/components/table/styles/table.style';
import { EmptyState } from '../../../shared/components/emptyState/screens/EmpyState';
import { formatCompanyDocument } from '../../../shared/utils/formatCompanyDocument.util';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

const Company = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(1);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [companies, setCompanies] = useState<CompanyResponseDto[]>([]);
    const [updating, setUpdating] = useState<CompanyFormData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

    const { userInformation } = getAuthenticationStorage();

    const handleReadCompanies = useCallback(async () => {
        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search };
            const response = await List(params);

            setCompanies(response.data);
            setTotal(response.total);
        } catch (error) {
            toast.error(`Erro ao listar Empresas: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search ]);

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
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
    const handleConfirmDelete = async () => {
        if (selectedCompanyId === null) {
            return;
        }

        try {
            await Delete({ id: selectedCompanyId });

            const isLastItemOnLastPage = companies.length === 1 && page > 1;

            setCompanies((previousCompanies: CompanyResponseDto[]) => previousCompanies.filter((company: CompanyResponseDto) => company.id !== selectedCompanyId));

            if (isLastItemOnLastPage) {
                setPage((previousPage: number) => previousPage - 1);
            } else {
                handleReadCompanies();
            }

            setIsDeleteModalOpen(false);

            toast.success("Empresa excluída com suceso");
        } catch (error: unknown) {
            toast.error("Não é possível prosseguir com a solicitação");
        } finally { }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleReadCompanies();
        }, 500);

        return () => clearTimeout(timeout);
    }, [ handleReadCompanies ]);

    return (
        <Fragment>
            { isLoading && (
                <LoadingState/>
            ) }
            { !isLoading && (
                <Finder showAddButton={ userInformation?.isSystemRoot ?? false } placeholder="Pesquise uma empresa por nome ou cnpj" buttonText="Cadastrar empresa" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } } />
            ) }
            { !isLoading && companies.length > 0 && (
                <Fragment>
                    <Table<CompanyResponseDto>
                        headers={[ "Nome", "Documento", "Descrição", "Criada em", "Editada em", ]}
                        data={ companies }
                        getEntityId={ (company: CompanyResponseDto) => company.id }
                        onEdit={ userInformation?.isSystemRoot ? handleUpdate : undefined }
                        onDelete={ userInformation?.isSystemRoot ? (id: number) => { setSelectedCompanyId(id); setIsDeleteModalOpen(true); } : undefined }
                        renderEntityRow={ (company: CompanyResponseDto) => (
                            <Fragment>
                                <Styled.TableListBodyRowData> { company.name } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <b> { formatCompanyDocument(company.document) } </b> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { company.description } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(company.createdAt, true) } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(company.updatedAt, true) } </Styled.TableListBodyRowData>
                            </Fragment>
                        ) }
                    />

                    <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } } />
                </Fragment>
            ) }
            { !isLoading && companies.length === 0 && (
                <EmptyState message="Nenhuma empresa encontrada" />
            ) }

            <Modal isOpen={ isDeleteModalOpen } entityName={ companies.find((company: CompanyResponseDto) => company.id === selectedCompanyId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleConfirmDelete } />

            <Drawer isOpen={ isDrawerOpen } isSubmitting={ isSubmitting } formId="company-form" title={ updating ? "Editar empresa" : "Nova empresa" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <CompanyForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); if (isSubmitting) { return; } setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleReadCompanies(); } } onLoadingChange={ setIsSubmitting } />
            </Drawer>
        </Fragment>
    );
}

export default Company;
