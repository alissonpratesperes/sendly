import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Search, Trash2, Pen } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { UserForm } from '../forms/UserForm';
import { UserDTO } from '../dtos/UserDTO.dto';
import { Read, Update, Delete } from '../services/User.service';
import { UserFormData } from '../schemas/UserFormSchema.schema';
import Modal from '../../../shared/components/modal/screens/Modal';
import * as Styled from '../../../shared/styles/Registration.style';
import EmptyStateVector from '../../../assets/emptystate_vector.svg';
import Pagination from '../../../shared/components/pagination/screens/Pagination';
import ToggleSwitch from '../../../shared/elements/toggleSwitch/screens/ToggleSwitch';
import { GenericDrawer } from '../../../shared/components/drawer/screens/GenericDrawer';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';

const User = () => {
    const [sort, setSort] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [updating, setUpdating] = useState<UserFormData | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [regionalNames, setRegionalNames] = useState<Record<number, string>>({});
    const userRole = localStorage.getItem('userRole');

    const { showLoading, hideLoading } = useLoading();

    const handleSort = () => {
        const isAscending = sort === 0;

        setSort(isAscending ? 1 : 0);
        setPage(1);
    };
    const handleCreate = () => {
        setUpdating(null);
        setDrawerOpen(true);
    };
    const handleRead = useCallback(async () => {
        try {
            showLoading();

            const params: PaginatedRequestDTO = { page, pageSize, sortBy: 'nome', sortDir: sort ? 'desc' : 'asc', search };
            const response = await Read(params);
            const itemsWithBoolean = response.items.map(item => ({ ...item, ativo: String(item.ativo).toLowerCase() === 'true' }));

            setUsers(itemsWithBoolean);
            setTotalPages(response.totalPages);

            const uniqueRegionalIds = Array.from(new Set(itemsWithBoolean.map(user => user.regionalId)));
            const missingRegionalIds = uniqueRegionalIds.filter(id => !regionalNames[id]);


        } catch (error) {
            toast.error(`Erro ao listar Usuários: ${error}`);
        } finally {
            hideLoading();
        };
    }, [page, pageSize, sort, search, regionalNames, showLoading, hideLoading]);
    const handleUpdate = (id: number) => {
        const clicked = users.find(user => user.id === id);

        if (clicked) {
            setUpdating({ ...clicked, senha: "" });
            setDrawerOpen(true);
        };
    };
    const handleConfirmDelete = async () => {
        if (selectedUserId === null) {
            return;
        };

        try {
            await Delete(selectedUserId);

            const isLastItemOnLastPage = users.length === 1 && page > 1;

            setUsers(previousUsers => previousUsers.filter(user => user.id !== selectedUserId));

            if (isLastItemOnLastPage) {
                setPage(prevPage => prevPage - 1);
            } else {
                handleRead();
            };

            setIsDeleteModalOpen(false);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.mensagem) {
                toast.error(error.response.data.mensagem);
            } else {
                console.log(error);

                toast.error('Um erro ocorreu ao realizar esta ação, tente novamente mais tarde');
            };
        };
    };
    const handleStatus = async (id: number, newStatus: boolean) => {
        try {
            const user = users.find(u => u.id === id);

            if (!user) {
                return;
            };

            const updatedUser = { ...user, ativo: newStatus };

            await Update(id, updatedUser);

            setUsers(previousUsers => previousUsers.map(u => (u.id === id ? { ...u, ativo: newStatus } : u)));
        } catch (error) {
            toast.error(`Erro ao alterar o status do Usuário: ${error}`);
        };
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleRead();
        }, 250);

        return () => clearTimeout(timeout);
    }, [handleRead]);

    return (
        <>
            <Styled.ListWrapper>
                <Styled.SearchInputWrapper>
                    <Styled.SearchInputContainer>
                        <Search size={20} />

                        <Styled.SearchInputField type="text" placeholder="Pesquisar usuário" value={search} onChange={(inputEvent) => { setSearch(inputEvent.target.value); setPage(1); }} />
                    </Styled.SearchInputContainer>

                    <Styled.AddButton onClick={handleCreate}>
                        <Plus size={20} />

                        <Styled.SearchInputSubmitText> Cadastrar usuário </Styled.SearchInputSubmitText>
                    </Styled.AddButton>
                </Styled.SearchInputWrapper>

                {users.length > 0 ? (
                    <Styled.TableWrapper>
                        <Styled.TableListWrapper>
                            <thead>
                                <Styled.TableListHeaderRow>
                                    <Styled.TableListHeaderRowColumn> Nome </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> Email </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> Regional </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn onClick={handleSort}> Status <Styled.SortArrow size={12} $isAsc={sort === 1} /> </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> </Styled.TableListHeaderRowColumn>
                                </Styled.TableListHeaderRow>
                            </thead>

                            <tbody>
                                {users.map(user => (
                                    <Styled.TableListBodyRow key={user.id}>
                                        <Styled.TableListBodyRowData> {user.nome} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData> {user.email} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData>  {regionalNames[user.regionalId]} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData> <ToggleSwitch label={user.ativo ? 'Ativo' : 'Inativo'} checked={user.ativo} onChange={(e) => handleStatus(user.id!, e.target.checked)} /> </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData>
                                            {userRole === 'Admin' && (<Styled.TableListBodyRowDataActionButton onClick={() => { setSelectedUserId(user.id!); setIsDeleteModalOpen(true); }}> <Trash2 size={20} /> </Styled.TableListBodyRowDataActionButton>)}
                                            <Styled.TableListBodyRowDataActionButton onClick={() => handleUpdate(user.id!)}> <Pen size={20} /> </Styled.TableListBodyRowDataActionButton>
                                        </Styled.TableListBodyRowData>
                                    </Styled.TableListBodyRow>
                                ))}

                                <Styled.TableListBodyRow>
                                    <Styled.TableListBodyRowData colSpan={5}>
                                        <Pagination pageSize={pageSize} totalPages={totalPages} currentPage={page} onPageChange={(newPage) => setPage(newPage)} onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(1); }} />
                                    </Styled.TableListBodyRowData>
                                </Styled.TableListBodyRow>
                            </tbody>
                        </Styled.TableListWrapper>
                    </Styled.TableWrapper>
                ) : (
                    <Styled.NotFoundContentContainer>
                        <Styled.NotFoundContentIllustration src={EmptyStateVector} />

                        <Styled.WithoutFoundContentText> Nenhum dado encontrado por aqui. </Styled.WithoutFoundContentText>
                    </Styled.NotFoundContentContainer>
                )}
            </Styled.ListWrapper>

            <Modal isOpen={isDeleteModalOpen} entityName={users.find(user => user.id === selectedUserId)?.nome ?? " "} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />

            <GenericDrawer isOpen={drawerOpen} onClose={() => { setDrawerOpen(false); setUpdating(null); }} title={updating ? 'Editar usuário' : 'Novo usuário'}>
                <UserForm initialValues={updating ?? undefined} onCancel={() => { setDrawerOpen(false); setUpdating(null); }} onSubmit={async () => { setDrawerOpen(false); setUpdating(null); handleRead(); }} />
            </GenericDrawer>
        </>
    );
};

export default User;