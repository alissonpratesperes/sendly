import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Search, Trash2, Pen } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { RegionalForm } from '../forms/RegionalForm';
import { RegionalDTO } from '../dtos/RegionalDTO.dto';
import Modal from '../../../shared/components/modal/screens/Modal';
import { Read, Update, Delete } from '../services/Regional.service';
import * as Styled from '../../../shared/styles/Registration.style';
import { RegionalFormData } from '../schemas/RegionalFormSchema.schema';
import Pagination from '../../../shared/components/pagination/screens/Pagination';
import ToggleSwitch from '../../../shared/elements/toggleSwitch/screens/ToggleSwitch';
import { Dawer } from '../../../shared/components/drawer/screens/Drawer';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';

const Regional = () => {
    const [sort, setSort] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [regionals, setRegionals] = useState<RegionalDTO[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [updating, setUpdating] = useState<RegionalFormData | null>(null);
    const [selectedRegionalId, setSelectedRegionalId] = useState<number | null>(null);
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

            setRegionals(itemsWithBoolean);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast.error(`Erro ao listar Regionais: ${error}`);
        } finally {
        };
    }, [page, pageSize, sort, search ]);
    const handleUpdate = (id: number) => {
        const clicked = regionals.find(regional => regional.id === id);

        if (clicked) {
            setUpdating(clicked);
            setDrawerOpen(true);
        };
    };
    const handleConfirmDelete = async () => {
        if (selectedRegionalId === null) {
            return;
        };

        try {
            await Delete(selectedRegionalId);

            const isLastItemOnLastPage = regionals.length === 1 && page > 1;

            setRegionals(previousRegionals => previousRegionals.filter(regional => regional.id !== selectedRegionalId));

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
            const regional = regionals.find(r => r.id === id);

            if (!regional) {
                return;
            };

            const updatedRegional = { ...regional, ativo: newStatus };

            await Update(id, updatedRegional);

            setRegionals(previousRegionals => previousRegionals.map(r => (r.id === id ? { ...r, ativo: newStatus } : r)));
        } catch (error) {
            toast.error(`Erro ao alterar o status da Regional: ${error}`);
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

                        <Styled.SearchInputField type="text" placeholder="Pesquisar regional" value={search} onChange={(inputEvent) => { setSearch(inputEvent.target.value); setPage(1); }} />
                    </Styled.SearchInputContainer>

                    <Styled.AddButton onClick={handleCreate}>
                        <Plus size={20} />

                        <Styled.SearchInputSubmitText> Cadastrar regional </Styled.SearchInputSubmitText>
                    </Styled.AddButton>
                </Styled.SearchInputWrapper>

                    <Styled.TableWrapper>
                        <Styled.TableListWrapper>
                            <thead>
                                <Styled.TableListHeaderRow>
                                    <Styled.TableListHeaderRowColumn> Nome da regional </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn onClick={handleSort}> Status <Styled.SortArrow size={12} $isAsc={sort === 1} /> </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> </Styled.TableListHeaderRowColumn>
                                </Styled.TableListHeaderRow>
                            </thead>

                            <tbody>
                                {regionals.map(regional => (
                                    <Styled.TableListBodyRow key={regional.id}>
                                        <Styled.TableListBodyRowData> {regional.nome} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData> <ToggleSwitch label={regional.ativo ? 'Ativo' : 'Inativo'} checked={regional.ativo} onChange={(e) => handleStatus(regional.id!, e.target.checked)} /> </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData>
                                            {userRole === 'Admin' && (<Styled.TableListBodyRowDataActionButton onClick={() => { setSelectedRegionalId(regional.id!); setIsDeleteModalOpen(true); }}> <Trash2 size={20} /> </Styled.TableListBodyRowDataActionButton>)}
                                            <Styled.TableListBodyRowDataActionButton onClick={() => handleUpdate(regional.id!)}> <Pen size={20} /> </Styled.TableListBodyRowDataActionButton>
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
            </Styled.ListWrapper>

            <Modal isOpen={isDeleteModalOpen} entityName={regionals.find(regional => regional.id === selectedRegionalId)?.nome ?? " "} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />

            <Dawer isOpen={drawerOpen} onClose={() => { setDrawerOpen(false); setUpdating(null); }} title={updating ? 'Editar regional' : 'Nova regional'}>
                <RegionalForm initialValues={updating ?? undefined} onCancel={() => { setDrawerOpen(false); setUpdating(null); }} onSubmit={() => { setDrawerOpen(false); setUpdating(null); setPage(1); handleRead(); }} />
            </Dawer>
        </>
    );
};

export default Regional;