import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Search, Trash2, Pen } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { ChainForm } from '../forms/ChainForm';
import { ChainDTO } from '../dtos/ChainDTO.dto';
import { Read, Update, Delete } from '../services/Chain.service';
import { ChainFormData } from '../schemas/ChainFormSchema.schema';
import Modal from '../../../shared/components/modal/screens/Modal';
import * as Styled from '../../../shared/styles/Registration.style';
// import Pagination from '../../../shared/components/pagination/screens/Pagination';
import ToggleSwitch from '../../../shared/elements/toggleSwitch/screens/ToggleSwitch';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
// import { PaginatedRequestDTO } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

const Chain = () => {
    const [sort, setSort] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [pageSize, setPageSize] = useState<number>(5);
    const [chains, setChains] = useState<ChainDTO[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [updating, setUpdating] = useState<ChainFormData | null>(null);
    const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
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

            setChains(itemsWithBoolean);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast.error(`Erro ao listar Redes: ${error}`);
        } finally {
        };
    }, [page, pageSize, sort, search ]);
    const handleUpdate = (id: number) => {
        const clicked = chains.find(chain => chain.id === id);

        if (clicked) {
            setUpdating(clicked);
            setDrawerOpen(true);
        };
    };
    const handleConfirmDelete = async () => {
        if (selectedChainId === null) {
            return;
        };

        try {
            await Delete(selectedChainId);

            const isLastItemOnLastPage = chains.length === 1 && page > 1;

            setChains(previousChains => previousChains.filter(chain => chain.id !== selectedChainId));

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
            const chain = chains.find(c => c.id === id);

            if (!chain) {
                return;
            };

            const updatedChain = { ...chain, ativo: newStatus };

            await Update(id, updatedChain);

            setChains(previousChains => previousChains.map(c => (c.id === id ? { ...c, ativo: newStatus } : c)));
        } catch (error) {
            toast.error(`Erro ao alterar o status da Rede: ${error}`);
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

                        <Styled.SearchInputField type="text" placeholder="Pesquisar rede" value={search} onChange={(inputEvent) => { setSearch(inputEvent.target.value); setPage(1); }} />
                    </Styled.SearchInputContainer>

                    <Styled.AddButton onClick={handleCreate}>
                        <Plus size={20} />

                        <Styled.SearchInputSubmitText> Cadastrar rede </Styled.SearchInputSubmitText>
                    </Styled.AddButton>
                </Styled.SearchInputWrapper>

                    <Styled.TableWrapper>
                        <Styled.TableListWrapper>
                            <thead>
                                <Styled.TableListHeaderRow>
                                    <Styled.TableListHeaderRowColumn> Nome da rede </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn onClick={handleSort}> Status </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> </Styled.TableListHeaderRowColumn>
                                </Styled.TableListHeaderRow>
                            </thead>

                            <tbody>
                                {chains.map(chain => (
                                    <Styled.TableListBodyRow key={chain.id}>
                                        <Styled.TableListBodyRowData> {chain.nome} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData> <ToggleSwitch label={chain.ativo ? 'Ativo' : 'Inativo'} checked={chain.ativo} onChange={(e) => handleStatus(chain.id!, e.target.checked)} /> </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData>
                                            {userRole === 'Admin' && (<Styled.TableListBodyRowDataActionButton onClick={() => { setSelectedChainId(chain.id!); setIsDeleteModalOpen(true); }}> <Trash2 size={20} /> </Styled.TableListBodyRowDataActionButton>)}
                                            <Styled.TableListBodyRowDataActionButton onClick={() => handleUpdate(chain.id!)}> <Pen size={20} /> </Styled.TableListBodyRowDataActionButton>
                                        </Styled.TableListBodyRowData>
                                    </Styled.TableListBodyRow>
                                ))}

                                <Styled.TableListBodyRow>
                                    <Styled.TableListBodyRowData colSpan={3}>
                                        {/* <Pagination pageSize={pageSize} totalPages={totalPages} currentPage={page} onPageChange={(newPage) => setPage(newPage)} onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(1); }} /> */}
                                    </Styled.TableListBodyRowData>
                                </Styled.TableListBodyRow>
                            </tbody>
                        </Styled.TableListWrapper>
                    </Styled.TableWrapper>
            </Styled.ListWrapper>

            <Modal isOpen={isDeleteModalOpen} entityName={chains.find(chain => chain.id === selectedChainId)?.nome ?? " "} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />

            <Drawer isOpen={drawerOpen} onClose={() => { setDrawerOpen(false); setUpdating(null); }} title={updating ? 'Editar rede' : 'Nova rede'}>
                <ChainForm initialValues={updating ?? undefined} onCancel={() => { setDrawerOpen(false); setUpdating(null); }} onSubmit={async () => { setDrawerOpen(false); setUpdating(null); handleRead(); }} />
            </Drawer>
        </>
    );
};

export default Chain;