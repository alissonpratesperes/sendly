import { toast } from 'react-toastify';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { UserForm } from '../forms/userForm.form';
import { UserStatus } from '../enums/userStatus.enum';
import { List, Delete } from '../services/user.service';
import { UserResponseDto } from '../dtos/userResponse.dto';
import { UserFormData } from '../schemas/userFormSchema.schema';
import Modal from '../../../shared/components/modal/screens/Modal';
import { formatDate } from '../../../shared/utils/formatDate.util';
import { Table } from '../../../shared/components/table/screens/Table';
import { Finder } from '../../../shared/components/finder/screen/Finder';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import Dropdown from '../../../shared/components/dropdown/screens/Dropdown';
import { CompanyResponseDto } from '../../company/dtos/companyResponse.dto';
import * as Styled from '../../../shared/components/table/styles/table.style';
import { List as ListCompanies } from '../../company/services/company.service';
import StatusBadge from '../../../shared/components/statusBadge/screens/StatusBadge';
import { EmptyState } from '../../../shared/components/emptyState/screens/EmpyState';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

const User = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [updating, setUpdating] = useState<UserFormData | null>(null);
    const [companies, setCompanies] = useState<CompanyResponseDto[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isCompaniesLoading, setIsCompaniesLoading] = useState<boolean>(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

    const { userInformation } = getAuthenticationStorage();

    const optionsForCompanies = useMemo(() => {
        return companies
            .filter((company) => company.id !== undefined && company.id !== null)
            .map((company) => ({ value: Number(company.id), label: company.name, }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [ companies ]);
    const selectedCompanyOption = useMemo(() => {
        return optionsForCompanies.find((option) => option.value === selectedCompanyId) ?? null;
    }, [ optionsForCompanies, selectedCompanyId ]);

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
    const handleRead = useCallback(async () => {
        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search, companyId: selectedCompanyId ?? undefined, };
            const response = await List(params);

            setUsers(response.data);
            setTotal(response.total);
        } catch (error) {
            toast.error(`Erro ao listar Usuários: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search, selectedCompanyId, ])
    const handleUpdate = (id: number) => {
        const clicked = users.find((user: UserResponseDto) => user.id === id);

        if (!clicked) {
            return;
        }

        setUpdating({
            id: clicked.id,
            companyId: clicked.companyId,
            name: clicked.name,
            email: clicked.email,
        });
        setIsDrawerOpen(true);
    }
    const handleDelete = async () => {
        if (selectedUserId === null) {
            return;
        }

        try {
            await Delete({ id: selectedUserId });

            setIsDeleteModalOpen(false);
            setSelectedUserId(null);

            if (users.length === 1 && page > 1) {
                setPage((previousPage: number) => previousPage - 1);
            } else {
                await handleRead();
            }

            toast.success("Usuário excluído com suceso");
        } catch (error: unknown) {
            toast.error("Não é possível prosseguir com a solicitação");
        } finally { }
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
                        const response = await ListCompanies({ page, limit, search, });

                        allFetchedCompanies = [ ...allFetchedCompanies, ...response.data ];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setCompanies(allFetchedCompanies);
                }

                await fetchAllCompanies();
            } catch (error) {
                toast.error(`Erro ao listar as opções de Empresas: ${ error }`);
            } finally {
                setIsCompaniesLoading(false);
            }
        }

        progressiveCompaniesFetch();
    }, []);
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
                <Styled.WhenInMultiSearchContainer>
                    <Styled.WhenInAnotherScreenWrapper>
                        <Dropdown
                            inputId="companyId"
                            isInBatchSendScreen={ true }
                            isLoading={ isCompaniesLoading }
                            isSearchable={ true }
                            isClearable={ true }
                            options={ optionsForCompanies }
                            placeholder="Filtre por uma empresa"
                            value={ selectedCompanyOption }
                            onChange={ (selectedOption) => { setSelectedCompanyId(selectedOption?.value ?? null); setPage(1); } }
                        />
                    </Styled.WhenInAnotherScreenWrapper>

                    <Finder showAddButton={ userInformation?.isSystemRoot ?? false } placeholder="Pesquise um usuário por nome ou e-mail" buttonText="Cadastrar usuário" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } }/>
                </Styled.WhenInMultiSearchContainer>
            ) }
            { !isLoading && users.length > 0 && (
                <Fragment>
                    <Table<UserResponseDto>
                        headers={[ "Nome", "E-mail", "Status", "Acesso", "Criado em", "Editado em", ]}
                        data={ users }
                        getEntityId={ (user: UserResponseDto) => user.id }
                        onEdit={ userInformation?.isSystemRoot ? handleUpdate : undefined }
                        onDelete={ userInformation?.isSystemRoot ? (id: number) => { setSelectedUserId(id); setIsDeleteModalOpen(true); } : undefined }
                        renderEntityRow={ (user: UserResponseDto) => (
                            <Fragment>
                                <Styled.TableListBodyRowData> { user.name } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <b> { user.email } </b> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <StatusBadge variant={ user.isFirstAccess ? UserStatus.FIRST_ACCESS : UserStatus.NOT_FIRST_ACCESS }/> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <StatusBadge variant={ user.isSystemRoot ? UserStatus.SYSTEM_ROOT : UserStatus.NOT_SYSTEM_ROOT }/> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(user.createdAt, true) } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(user.updatedAt, true) } </Styled.TableListBodyRowData>
                            </Fragment>
                        ) }
                        canEdit={ true }
                        canDelete={ true }
                    />

                    <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } }/>
                </Fragment>
            ) }
            { !isLoading && users.length === 0 && (
                <EmptyState message="Nenhum usuário encontrado" />
            ) }

            <Modal isOpen={ isDeleteModalOpen } entityName={ users.find((user: UserResponseDto) => user.id === selectedUserId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleDelete }/>

            <Drawer isOpen={ isDrawerOpen } isSubmitting={ isSubmitting } formId="user-form" title={ updating ? "Editar usuário" : "Novo usuário" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <UserForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); if (isSubmitting) { return; } setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleRead(); } } onLoadingChange={ setIsSubmitting }/>
            </Drawer>
        </Fragment>
    );
}

export default User;
