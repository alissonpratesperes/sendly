import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Search, Trash2, Pen } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { CategoryForm } from '../forms/CategoryForm';
import { CategoryDTO } from '../dtos/CategoryDTO.dto';
import Modal from '../../../shared/components/modal/screens/Modal';
import { Read, Update, Delete } from '../services/Category.service';
import * as Styled from '../../../shared/styles/Registration.style';
import EmptyStateVector from '../../../assets/emptystate_vector.svg';
import { CategoryFormData } from '../schemas/CategoryFormSchema.schema';
import Pagination from '../../../shared/components/pagination/screens/Pagination';
import ToggleSwitch from '../../../shared/elements/toggleSwitch/screens/ToggleSwitch';
import { GenericDrawer } from '../../../shared/components/drawer/screens/GenericDrawer';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';

const Category = () => {
    const [sort, setSort] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [updating, setUpdating] = useState<CategoryFormData | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
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

            setCategories(itemsWithBoolean);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast.error(`Erro ao listar Categorias: ${error}`);
        } finally {
        };
    }, [page, pageSize, sort, search ]);
    const handleUpdate = (id: number) => {
        const clicked = categories.find(category => category.id === id);

        if (clicked) {
            setUpdating(clicked);
            setDrawerOpen(true);
        };
    };
    const handleConfirmDelete = async () => {
        if (selectedCategoryId === null) {
            return;
        };

        try {
            await Delete(selectedCategoryId);

            const isLastItemOnLastPage = categories.length === 1 && page > 1;

            setCategories(previousCategories => previousCategories.filter(categories => categories.id !== selectedCategoryId));

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
            const category = categories.find(c => c.id === id);

            if (!category) {
                return;
            };

            const updatedCategory = { ...category, ativo: newStatus };

            await Update(id, updatedCategory);

            setCategories(previousCategories => previousCategories.map(c => (c.id === id ? { ...c, ativo: newStatus } : c)));
        } catch (error) {
            toast.error(`Erro ao alterar o status da Categoria: ${error}`);
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

                        <Styled.SearchInputField type="text" placeholder="Pesquisar categoria" value={search} onChange={(inputEvent) => { setSearch(inputEvent.target.value); setPage(1); }} />
                    </Styled.SearchInputContainer>

                    <Styled.AddButton onClick={handleCreate}>
                        <Plus size={20} />

                        <Styled.SearchInputSubmitText> Cadastrar categoria </Styled.SearchInputSubmitText>
                    </Styled.AddButton>
                </Styled.SearchInputWrapper>

                {categories.length > 0 ? (
                    <Styled.TableWrapper>
                        <Styled.TableListWrapper>
                            <thead>
                                <Styled.TableListHeaderRow>
                                    <Styled.TableListHeaderRowColumn> Nome da categoria </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn onClick={handleSort}> Status <Styled.SortArrow size={12} $isAsc={sort === 1} /> </Styled.TableListHeaderRowColumn>
                                    <Styled.TableListHeaderRowColumn> </Styled.TableListHeaderRowColumn>
                                </Styled.TableListHeaderRow>
                            </thead>

                            <tbody>
                                {categories.map(category => (
                                    <Styled.TableListBodyRow key={category.id}>
                                        <Styled.TableListBodyRowData> {category.nome} </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData> <ToggleSwitch label={category.ativo ? 'Ativo' : 'Inativo'} checked={category.ativo} onChange={(e) => handleStatus(category.id!, e.target.checked)} /> </Styled.TableListBodyRowData>
                                        <Styled.TableListBodyRowData>
                                            {userRole === 'Admin' && (<Styled.TableListBodyRowDataActionButton onClick={() => { setSelectedCategoryId(category.id!); setIsDeleteModalOpen(true); }}> <Trash2 size={20} /> </Styled.TableListBodyRowDataActionButton>)}
                                            <Styled.TableListBodyRowDataActionButton onClick={() => handleUpdate(category.id!)}> <Pen size={20} /> </Styled.TableListBodyRowDataActionButton>
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

            <Modal isOpen={isDeleteModalOpen} entityName={categories.find(category => category.id === selectedCategoryId)?.nome ?? " "} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />

            <GenericDrawer isOpen={drawerOpen} onClose={() => { setDrawerOpen(false); setUpdating(null); }} title={updating ? 'Editar categoria' : 'Nova categoria'}>
                <CategoryForm initialValues={updating ?? undefined} onCancel={() => { setDrawerOpen(false); setUpdating(null); }} onSubmit={async () => { setDrawerOpen(false); setUpdating(null); handleRead(); }} />
            </GenericDrawer>
        </>
    );
};

export default Category;