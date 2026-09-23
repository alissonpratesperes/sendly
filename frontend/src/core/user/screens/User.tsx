import { toast } from 'react-toastify';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { UserForm } from '../forms/userForm.form';
import { List, Delete } from '../services/user.service';
import { UserResponseDto } from '../dtos/userResponse.dto';
import { UserFormData } from '../schemas/userFormSchema.schema';
import Modal from '../../../shared/components/modal/screens/Modal';
import { formatDate } from '../../../shared/utils/formatDate.util';
import { Table } from '../../../shared/components/table/screens/Table';
import { Finder } from '../../../shared/components/finder/screen/Finder';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import * as Styled from '../../../shared/components/table/styles/table.style';
import UserBadge from '../../../shared/components/userBadge/screens/UserBadge';
import { EmptyState } from '../../../shared/components/emptyState/screens/EmpyState';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';
import { UserBadgeVariant } from '../../../shared/components/userBadge/enums/userBadgeVariant.enum';

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
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

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

            setUsers(response.data);
            setTotal(response.total);
        } catch (error) {
            toast.error(`Erro ao listar Usuários: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search ]);
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
                <Finder showAddButton={ userInformation?.isSystemRoot ?? false } placeholder="Pesquise um usuário por nome ou e-mail" buttonText="Cadastrar usuário" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } } />
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
                                <Styled.TableListBodyRowData> <UserBadge variant={ user.isFirstAccess ? UserBadgeVariant.FIRST_ACCESS : UserBadgeVariant.NOT_FIRST_ACCESS } /> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <UserBadge variant={ user.isSystemRoot ? UserBadgeVariant.SYSTEM_ROOT : UserBadgeVariant.NOT_SYSTEM_ROOT } /> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(user.createdAt, true) } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(user.updatedAt, true) } </Styled.TableListBodyRowData>
                            </Fragment>
                        ) }
                    />

                    <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } } />
                </Fragment>
            ) }
            { !isLoading && users.length === 0 && (
                <EmptyState message="Nenhum usuário encontrado" />
            ) }

            <Modal isOpen={ isDeleteModalOpen } entityName={ users.find((user: UserResponseDto) => user.id === selectedUserId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleDelete } />

            <Drawer isOpen={ isDrawerOpen } isSubmitting={ isSubmitting } formId="user-form" title={ updating ? "Editar usuário" : "Novo usuário" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <UserForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); if (isSubmitting) { return; } setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleRead(); } } onLoadingChange={ setIsSubmitting } />
            </Drawer>
        </Fragment>
    );
}

export default User;
