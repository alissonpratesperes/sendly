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
import UserBadge from '../../../shared/elements/userBadge/screens/UserBadge';
import * as Styled from '../../../shared/components/table/styles/table.style';
import { EmptyState } from '../../../shared/components/emptyState/screens/EmpyState';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

const User = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(1);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [updating, setUpdating] = useState<UserFormData | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const handleReadUsers = useCallback(async () => {
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

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
    const handleUpdate = (id: number) => {
        const clicked = users.find((user: UserResponseDto) => user.id === id);

        if (!clicked) {
            return;
        }

        setUpdating({
            id: clicked.id,
            name: clicked.name,
            email: clicked.email,
        });
        setIsDrawerOpen(true);
    }
    const handleConfirmDelete = async () => {
        if (selectedUserId === null) {
            return;
        }

        try {
            await Delete({ id: selectedUserId });

            const isLastItemOnLastPage = users.length === 1 && page > 1;

            setUsers((previousUsers: UserResponseDto[]) => previousUsers.filter((user: UserResponseDto) => user.id !== selectedUserId));

            if (isLastItemOnLastPage) {
                setPage((previousPage: number) => previousPage - 1);
            } else {
                handleReadUsers();
            }

            setIsDeleteModalOpen(false);

            toast.success("Usuário excluído com suceso");
        } catch (error: unknown) {
            toast.error(`Não é possível prosseguir com a solicitação: ${ error }`);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleReadUsers();
        }, 500);

        return () => clearTimeout(timeout);
    }, [ handleReadUsers ]);

    return (
        <Fragment>
            <Finder placeholder="Pesquise um usuário por nome ou e-mail" buttonText="Cadastrar usuário" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } } />

            { isLoading && (
                <LoadingState/>
            ) }
            { !isLoading && users.length > 0 && (
                <Fragment>
                    <Table<UserResponseDto>
                        headers={[ "Nome", "E-mail", "Status", "Acesso", "Criado em", "Editado em", ]}
                        data={ users }
                        getEntityId={ (user: UserResponseDto) => user.id }
                        onEdit={ handleUpdate }
                        onDelete={ (id: number) => { setSelectedUserId(id); setIsDeleteModalOpen(true); } }
                        renderEntityRow={ (user: UserResponseDto) => (
                            <Fragment>
                                <Styled.TableListBodyRowData> { user.name } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <b> { user.email } </b> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <UserBadge variant={ user.isFirstAccess ? "isFirstAccess" : "notIsFirstAccess" } /> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <UserBadge variant={ user.isSystemRoot ? "isSystemRoot" : "notIsSystemRoot" } /> </Styled.TableListBodyRowData>
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

            <Modal isOpen={ isDeleteModalOpen } entityName={ users.find((user: UserResponseDto) => user.id === selectedUserId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleConfirmDelete } />

            <Drawer isOpen={ isDrawerOpen } formId="user-form" title={ updating ? "Editar usuário" : "Novo usuário" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <UserForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleReadUsers(); } } />
            </Drawer>
        </Fragment>
    );
}

export default User;
