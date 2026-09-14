import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { Plus, Search, Trash, Pen } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { UserForm } from '../forms/userForm.form';
import { List, Delete } from '../services/user.service';
import { UserResponseDto } from '../dtos/userResponse.dto';
import { UserFormData } from '../schemas/userFormSchema.schema';
import Modal from '../../../shared/components/modal/screens/Modal';
import { formatDate } from '../../../shared/utils/formatDate.util';
import * as SharedStyled from '../../../shared/styles/Registration.style';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import UserBadge from '../../../shared/elements/userBadge/screens/UserBadge';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
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

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
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

            setUsers(previousUsers => previousUsers.filter((user: UserResponseDto) => user.id !== selectedUserId));

            if (isLastItemOnLastPage) {
                setPage(prevPage => prevPage - 1);
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
            <SharedStyled.ListWrapper>
                <SharedStyled.SearchInputWrapper>
                    <SharedStyled.SearchInputContainer>
                        <Search size={ 25 } color="#1C70E9" />

                        <SharedStyled.SearchInputField type="text" placeholder="Pesquisar usuário" value={ search } onChange={ (inputEvent) => { setSearch(inputEvent.target.value); setPage(1); } } />
                    </SharedStyled.SearchInputContainer>

                    <SharedStyled.AddButton onClick={ handleCreate }>
                        <Plus size={ 25 } />

                        <SharedStyled.SearchInputSubmitText> Cadastrar usuário </SharedStyled.SearchInputSubmitText>
                    </SharedStyled.AddButton>
                </SharedStyled.SearchInputWrapper>

                { isLoading && (
                    <SharedStyled.LoadingContainer>
                        <PropagateLoader size={ 25 } color="#171719" />
                    </SharedStyled.LoadingContainer>
                ) }

                { users.length > 0 ? (
                    <SharedStyled.TableWrapper>
                        <SharedStyled.TableListWrapper>
                            <thead>
                                <SharedStyled.TableListHeaderRow>
                                    <SharedStyled.TableListHeaderRowColumn> Nome </SharedStyled.TableListHeaderRowColumn>
                                    <SharedStyled.TableListHeaderRowColumn> Email </SharedStyled.TableListHeaderRowColumn>
                                    <SharedStyled.TableListHeaderRowColumn> Status </SharedStyled.TableListHeaderRowColumn>
                                    <SharedStyled.TableListHeaderRowColumn> Acesso </SharedStyled.TableListHeaderRowColumn>
                                    <SharedStyled.TableListHeaderRowColumn> Criado em </SharedStyled.TableListHeaderRowColumn>
                                    <SharedStyled.TableListHeaderRowColumn> Editado em </SharedStyled.TableListHeaderRowColumn>
                                    <SharedStyled.TableListHeaderRowColumn> </SharedStyled.TableListHeaderRowColumn>
                                    <SharedStyled.TableListHeaderRowColumn> </SharedStyled.TableListHeaderRowColumn>
                                </SharedStyled.TableListHeaderRow>
                            </thead>

                            <tbody>
                                { users.map((user: UserResponseDto) => (
                                    <SharedStyled.TableListBodyRow key={ user.id }>
                                        <SharedStyled.TableListBodyRowData> { user.name } </SharedStyled.TableListBodyRowData>
                                        <SharedStyled.TableListBodyRowData> { user.email } </SharedStyled.TableListBodyRowData>
                                        <SharedStyled.TableListBodyRowData> <UserBadge variant={ user.isFirstAccess ? "isFirstAccess" : "notIsFirstAccess" } /> </SharedStyled.TableListBodyRowData>
                                        <SharedStyled.TableListBodyRowData> <UserBadge variant={ user.isSystemRoot ? "isSystemRoot" : "notIsSystemRoot" } /> </SharedStyled.TableListBodyRowData>
                                        <SharedStyled.TableListBodyRowData> { formatDate(user.createdAt) } </SharedStyled.TableListBodyRowData>
                                        <SharedStyled.TableListBodyRowData> { formatDate(user.updatedAt) } </SharedStyled.TableListBodyRowData>
                                        <SharedStyled.TableListBodyRowData> </SharedStyled.TableListBodyRowData>
                                        <SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowDataActions>
                                                <SharedStyled.TableListBodyRowDataActionButton onClick={ () => handleUpdate(user.id) }> <Pen size={ 25 } color="#1C70E9" /> </SharedStyled.TableListBodyRowDataActionButton>
                                                <SharedStyled.TableListBodyRowDataActionButton onClick={ () => { setSelectedUserId(user.id); setIsDeleteModalOpen(true); } }> <Trash size={ 25 } color="#DC143C" /> </SharedStyled.TableListBodyRowDataActionButton>
                                            </SharedStyled.TableListBodyRowDataActions>
                                        </SharedStyled.TableListBodyRowData>
                                    </SharedStyled.TableListBodyRow>
                                )) }
                            </tbody>

                            <tfoot>
                                <SharedStyled.TableListBodyRow>
                                    <SharedStyled.TableListBodyRowData colSpan={ 8 }>
                                        <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit) => { setLimit(newLimit); setPage(1); } } />
                                    </SharedStyled.TableListBodyRowData>
                                </SharedStyled.TableListBodyRow>
                            </tfoot>
                        </SharedStyled.TableListWrapper>
                    </SharedStyled.TableWrapper>
                ) : !isLoading ? (
                    <SharedStyled.TableWrapper>
                        <SharedStyled.TableListWrapper>
                            <thead>
                                <SharedStyled.TableListHeaderRow>
                                    <SharedStyled.TableListHeaderRowColumn>
                                        Verifique os dados informados na busca, ou se for a sua primeira vez utilizando a aplicação, realize o cadastro das informações!
                                    </SharedStyled.TableListHeaderRowColumn>
                                </SharedStyled.TableListHeaderRow>
                            </thead>

                            <tbody>
                                <SharedStyled.TableListBodyRow>
                                    <SharedStyled.TableListBodyRowData>
                                        Nenhum registro encontrado por aqui.
                                    </SharedStyled.TableListBodyRowData>
                                </SharedStyled.TableListBodyRow>
                            </tbody>
                        </SharedStyled.TableListWrapper>
                    </SharedStyled.TableWrapper>
                ) : null }
            </SharedStyled.ListWrapper>

            <Modal isOpen={ isDeleteModalOpen } entityName={ users.find((user: UserResponseDto) => user.id === selectedUserId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleConfirmDelete } />

            <Drawer isOpen={ isDrawerOpen } formId="user-form" title={ updating ? "Editar usuário" : "Novo usuário" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <UserForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleReadUsers(); } } />
            </Drawer>
        </Fragment>
    );
}

export default User;
