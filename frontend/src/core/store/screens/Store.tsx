import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Search, Trash2, Pen } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { StoreForm } from '../forms/StoreForm';
import { StoreDTO } from '../dtos/StoreDTO.dto';
import { ReadById } from '../../chain/services/Chain.service';
import { Read, Update, Delete } from '../services/Store.service';
import { StoreFormData } from '../schemas/StoreFormSchema.schema';
import Modal from '../../../shared/components/modal/screens/Modal';
import * as Styled from '../../../shared/styles/Registration.style';
import EmptyStateVector from '../../../assets/emptystate_vector.svg';
import { cnpjFormatterUtil } from '../../../shared/utils/cnpjFormatterUtil.util';
import Pagination from '../../../shared/components/pagination/screens/Pagination';
import ToggleSwitch from '../../../shared/elements/toggleSwitch/screens/ToggleSwitch';
import { GenericDrawer } from '../../../shared/components/drawer/screens/GenericDrawer';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';

const Store = () => {
    const [sort, setSort] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [pageSize, setPageSize] = useState<number>(5);
    const [stores, setStores] = useState<StoreDTO[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [updating, setUpdating] = useState<StoreFormData | null>(null);
    const [chainNames, setChainNames] = useState<Record<number, string>>({});
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
    const chainNamesRef = useRef(chainNames);
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

            const params: PaginatedRequestDTO = { page, pageSize, sortBy: 'razaoSocial', sortDir: sort ? 'desc' : 'asc', search };
            const response = await Read(params);
            const itemsWithBoolean = response.items.map(item => ({ ...item, ativo: String(item.ativo).toLowerCase() === 'true' }));

            setStores(itemsWithBoolean);
            setTotalPages(response.totalPages);

            const uniqueChainIds = Array.from(new Set(itemsWithBoolean.map(store => store.redeId)));
            const missingChainIds = uniqueChainIds.filter(id => !chainNamesRef.current[id]);

            if (missingChainIds.length > 0) {
                const responses = await Promise.all(missingChainIds.map(id => ReadById(id).then(response => ({ id, nome: response.nome })).catch(() => null)));
                const newChains: Record<number, string> = {};

                for (const response of responses) {
                    if (response) {
                        newChains[response.id] = response.nome;
                    };
                };

                setChainNames(previousChainNames => ({ ...previousChainNames, ...newChains }));
            };
        } catch (error) {
            toast.error(`Erro ao listar Lojas: ${error}`);
        } finally {
            hideLoading();
        };
    }, [page, pageSize, sort, search, showLoading, hideLoading]);
    const handleUpdate = (id: number) => {
        const clicked = stores.find(store => store.id === id);

        if (clicked) {
            setUpdating(clicked);
            setDrawerOpen(true);
        };
    };
    const handleConfirmDelete = async () => {
        if (selectedStoreId === null) {
            return;
        };

        try {
            await Delete(selectedStoreId);

            const isLastItemOnLastPage = stores.length === 1 && page > 1;

            setStores(previousStores => previousStores.filter(store => store.id !== selectedStoreId));

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
            const store = stores.find(s => s.id === id);

            if (!store) {
                return;
            };

            const updatedStore = { ...store, ativo: newStatus };

            await Update(id, updatedStore);

            setStores(previousStores => previousStores.map(s => (s.id === id ? { ...s, ativo: newStatus } : s)));
        } catch (error) {
            toast.error(`Erro ao alterar o status da Loja: ${error}`);
        };
    };

    useEffect(() => {
        chainNamesRef.current = chainNames;
    }, [chainNames]);
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

                        <Styled.SearchInputField type="text" placeholder="Pesquisar loja" value={search} onChange={(inputEvent) => { setSearch(inputEvent.target.value); setPage(1); }} />
                    </Styled.SearchInputContainer>

                    <Styled.AddButton onClick={handleCreate}>
                        <Plus size={20} />

                        <Styled.SearchInputSubmitText> Cadastrar loja </Styled.SearchInputSubmitText>
                    </Styled.AddButton>
                </Styled.SearchInputWrapper>

                {stores.length > 0 ? (
                    <Styled.TableWrapper>
                        <Styled.TableListWrapper>
                            <thead>
                                <Styled.TableListHeaderRow>
                                    <Styled.TableListHeaderRowColumn> Nome da loja </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> CNPJ </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> Rede vinculada </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> Endereço </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn onClick={handleSort}> Status <Styled.SortArrow size={12} $isAsc={sort === 1} /> </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> </Styled.TableListHeaderRowColumn>
                                </Styled.TableListHeaderRow>
                            </thead>

                            <tbody>
                                {stores.map(store => (
                                    <Styled.TableListBodyRow key={store.id}>
                                        <Styled.TableListBodyRowData> {store.razaoSocial} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData> {cnpjFormatterUtil(store.cnpj)} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData> {chainNames[store.redeId]} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData> {store.endereco} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData> <ToggleSwitch label={store.ativo ? 'Ativo' : 'Inativo'} checked={store.ativo} onChange={(e) => handleStatus(store.id!, e.target.checked)} /> </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData>
                                            {userRole === 'Admin' && (<Styled.TableListBodyRowDataActionButton onClick={() => { setSelectedStoreId(store.id!); setIsDeleteModalOpen(true); }}> <Trash2 size={20} /> </Styled.TableListBodyRowDataActionButton>)}
                                            <Styled.TableListBodyRowDataActionButton onClick={() => handleUpdate(store.id!)}> <Pen size={20} /> </Styled.TableListBodyRowDataActionButton>
                                        </Styled.TableListBodyRowData>
                                    </Styled.TableListBodyRow>
                                ))}

                                <Styled.TableListBodyRow>
                                    <Styled.TableListBodyRowData colSpan={6}>
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

            <Modal isOpen={isDeleteModalOpen} entityName={stores.find(store => store.id === selectedStoreId)?.apelido ?? " "} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />

            <GenericDrawer isOpen={drawerOpen} onClose={() => { setDrawerOpen(false); setUpdating(null); }} title={updating ? 'Editar loja' : 'Nova loja'}>
                <StoreForm initialValues={updating ?? undefined} onCancel={() => { setDrawerOpen(false); setUpdating(null); }} onSubmit={async () => { setDrawerOpen(false); setUpdating(null); handleRead(); }} />
            </GenericDrawer>
        </>
    );
};

export default Store;