import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Search, Trash2, Pen } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { ActionForm } from '../forms/ActionForm';
import { ActionDTO } from '../dtos/ActionDTO.dto';
import { Read, Update, Delete } from '../services/Action.service';
import Modal from '../../../shared/components/modal/screens/Modal';
import * as Styled from '../../../shared/styles/Registration.style';
import { ActionFormData } from '../schemas/ActionFormSchema.schema';
import EmptyStateVector from '../../../assets/emptystate_vector.svg';
import Pagination from '../../../shared/components/pagination/screens/Pagination';
import ToggleSwitch from '../../../shared/elements/toggleSwitch/screens/ToggleSwitch';
import { GenericDrawer } from '../../../shared/components/drawer/screens/GenericDrawer';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';

const Action = () => {
    const [sort, setSort] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [pageSize, setPageSize] = useState<number>(5);
    const [actions, setActions] = useState<ActionDTO[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [updating, setUpdating] = useState<ActionFormData | null>(null);
    const [selectedActionId, setSelectedActionId] = useState<number | null>(null);
    const userRole = localStorage.getItem('userRole');


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
            const params: PaginatedRequestDTO = { page, pageSize, sortBy: 'nome', sortDir: sort ? 'desc' : 'asc', search };
            const response = await Read(params);
            const itemsWithBoolean = response.items.map(item => ({ ...item, ativo: String(item.ativo).toLowerCase() === 'true' }));

            setActions(itemsWithBoolean);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast.error(`Erro ao listar Tipos de Ação: ${error}`);
        } finally {
        };
    }, [page, pageSize, sort, search ]);
    const handleUpdate = (id: number) => {
        const clicked = actions.find(action => action.id === id);

        if (clicked) {
            setUpdating(clicked);
            setDrawerOpen(true);
        };
    };
    const handleConfirmDelete = async () => {
        if (selectedActionId === null) {
            return;
        };

        try {
            await Delete(selectedActionId);

            const isLastItemOnLastPage = actions.length === 1 && page > 1;

            setActions(previousActions => previousActions.filter(action => action.id !== selectedActionId));

            if (isLastItemOnLastPage) {
                setPage(prevPage => prevPage - 1);
            } else {
                handleRead();
            };

            setIsDeleteModalOpen(false);
        } catch (error: unknown) {
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
            const action = actions.find(a => a.id === id);

            if (!action) {
                return;
            };

            const updatedAction = { ...action, ativo: newStatus };

            await Update(id, updatedAction);

            setActions(previousActions => previousActions.map(a => (a.id === id ? { ...a, ativo: newStatus } : a)));
        } catch (error) {
            toast.error(`Erro ao alterar o status do Tipo de Ação: ${error}`);
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

                        <Styled.SearchInputField type="text" placeholder="Pesquisar tipo" value={search} onChange={(inputEvent) => { setSearch(inputEvent.target.value); setPage(1); }} />
                    </Styled.SearchInputContainer>

                    <Styled.AddButton onClick={handleCreate}>
                        <Plus size={20} />

                        <Styled.SearchInputSubmitText> Cadastrar Tipo de Ação </Styled.SearchInputSubmitText>
                    </Styled.AddButton>
                </Styled.SearchInputWrapper>

                {actions.length > 0 ? (
                    <Styled.TableWrapper>
                        <Styled.TableListWrapper>
                            <thead>
                                <Styled.TableListHeaderRow>
                                    <Styled.TableListHeaderRowColumn> Nome da ação </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn onClick={handleSort}> Status <Styled.SortArrow size={12} $isAsc={sort === 1} /> </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> </Styled.TableListHeaderRowColumn>
                                </Styled.TableListHeaderRow>
                            </thead>

                            <tbody>
                                {actions.map(action => (
                                    <Styled.TableListBodyRow key={action.id}>
                                        <Styled.TableListBodyRowData> {action.nome} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData> <ToggleSwitch label={action.ativo ? 'Ativo' : 'Inativo'} checked={action.ativo} onChange={(e) => handleStatus(action.id!, e.target.checked)} /> </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData>
                                            {userRole === 'Admin' && (<Styled.TableListBodyRowDataActionButton onClick={() => { setSelectedActionId(action.id!); setIsDeleteModalOpen(true); }}> <Trash2 size={20} /> </Styled.TableListBodyRowDataActionButton>)}
                                            <Styled.TableListBodyRowDataActionButton onClick={() => handleUpdate(action.id!)}> <Pen size={20} /> </Styled.TableListBodyRowDataActionButton>
                                        </Styled.TableListBodyRowData>
                                    </Styled.TableListBodyRow>
                                ))}

                                <Styled.TableListBodyRow>
                                    <Styled.TableListBodyRowData colSpan={3}>
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

            <Modal isOpen={isDeleteModalOpen} entityName={actions.find(action => action.id === selectedActionId)?.nome ?? " "} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />

            <GenericDrawer isOpen={drawerOpen} onClose={() => { setDrawerOpen(false); setUpdating(null); }} title={updating ? 'Editar tipo de ação' : 'Novo tipo de ação'}>
                <ActionForm initialValues={updating ?? undefined} onCancel={() => { setDrawerOpen(false); setUpdating(null); }} onSubmit={async () => { setDrawerOpen(false); setUpdating(null); handleRead(); }} />
            </GenericDrawer>
        </>
    );
};

export default Action;