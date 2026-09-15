import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { Plus, Search, Trash, Pen } from 'lucide-react';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ListForm } from '../forms/listForm.form';
import { List, Delete } from '../services/list.service';
import { ListResponseDto } from '../dtos/listResponse.dto';
import { formatDate } from '../../../shared/utils/formatDate.util';
import Modal from '../../../shared/components/modal/screens/Modal';
import { ListFormData } from '../schemas/listFormSchema.schema';
import * as SharedStyled from '../../../shared/styles/Registration.style';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import { formatCompanyDocument } from '../../../shared/utils/formatCompanyDocument.util';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

const Lists = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(1);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [lists, setLists] = useState<ListResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [updating, setUpdating] = useState<ListFormData | null>(null);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
    const handleReadLists = useCallback(async () => {
        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search };
            const response = await List(params);

            setLists(response.data);
            setTotal(response.total);
        } catch (error) {
            toast.error(`Erro ao listar Listas: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search ]);
    const handleUpdate = (id: number) => {
        const clicked = lists.find((list: ListResponseDto) => list.id === id);

        if (!clicked) {
            return;
        }

        setUpdating({
            id: clicked.id,
            companyId: clicked.companyId,
            name: clicked.name,
            subject: clicked.subject,
            color: clicked.color,
        });
        setIsDrawerOpen(true);
    }
    const handleConfirmDelete = async () => {
        if (selectedListId === null) {
            return;
        }

        try {
            await Delete({ id: selectedListId });

            const isLastItemOnLastPage = lists.length === 1 && page > 1;

            setLists((previousLists: ListResponseDto[]) => previousLists.filter((list: ListResponseDto) => list.id !== selectedListId));

            if (isLastItemOnLastPage) {
                setPage((previousPage: number) => previousPage - 1);
            } else {
                handleReadLists();
            }

            setIsDeleteModalOpen(false);

            toast.success("Lista excluída com suceso");
        } catch (error: unknown) {
            toast.error(`Não é possível prosseguir com a solicitação: ${ error }`);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleReadLists();
        }, 500);

        return () => clearTimeout(timeout);
    }, [ handleReadLists ]);

    return (
        <Fragment>
            <SharedStyled.ListWrapper>
                <SharedStyled.SearchInputWrapper>
                    <SharedStyled.SearchInputContainer>
                        <Search size={ 25 } color="#1C70E9" />

                        <SharedStyled.SearchInputField type="text" placeholder="Pesquise uma lista por nome ou assunto" value={ search } onChange={ (inputEvent) => { setSearch(inputEvent.target.value); setPage(1); } } />
                    </SharedStyled.SearchInputContainer>

                    <SharedStyled.AddButton onClick={ handleCreate }>
                        <Plus size={ 25 } />

                        <SharedStyled.SearchInputSubmitText> Cadastrar lista </SharedStyled.SearchInputSubmitText>
                    </SharedStyled.AddButton>
                </SharedStyled.SearchInputWrapper>

                { isLoading && (
                    <SharedStyled.LoadingContainer>
                        <PropagateLoader size={ 25 } color="#171719" />
                    </SharedStyled.LoadingContainer>
                ) }
                { lists.length > 0 ? (
                    <Fragment>
                        <SharedStyled.TableWrapper>
                            <SharedStyled.TableListWrapper>
                                <thead>
                                    <SharedStyled.TableListHeaderRow>
                                        <SharedStyled.TableListHeaderRowColumn> Nome </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> Assunto </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> Criada em </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> Editada em </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> </SharedStyled.TableListHeaderRowColumn>
                                    </SharedStyled.TableListHeaderRow>
                                </thead>
                                <tbody>
                                    { lists.map((list: ListResponseDto) => (
                                        <SharedStyled.TableListBodyRow key={ list.id }>
                                            <SharedStyled.TableListBodyRowData> <SharedStyled.TableListColorContent> <SharedStyled.TableListColorFragment $color={ list.color } /> <b> { list.name } </b> </SharedStyled.TableListColorContent>
                                            </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData> { list.subject } </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData> { formatDate(list.createdAt, true) } </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData> { formatDate(list.updatedAt, true) } </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData>
                                                <SharedStyled.TableListBodyRowDataActions>
                                                    <SharedStyled.TableListBodyRowDataActionButton onClick={ () => handleUpdate(list.id) }> <Pen size={ 25 } color="#1C70E9" /> </SharedStyled.TableListBodyRowDataActionButton>
                                                    <SharedStyled.TableListBodyRowDataActionButton onClick={ () => { setSelectedListId(list.id); setIsDeleteModalOpen(true); } }> <Trash size={ 25 } color="#DC143C" /> </SharedStyled.TableListBodyRowDataActionButton>
                                                </SharedStyled.TableListBodyRowDataActions>
                                            </SharedStyled.TableListBodyRowData>
                                        </SharedStyled.TableListBodyRow>
                                    )) }
                                </tbody>
                            </SharedStyled.TableListWrapper>
                        </SharedStyled.TableWrapper>

                        <SharedStyled.FooterPaginateWrapper>
                            <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } } />
                        </SharedStyled.FooterPaginateWrapper>
                    </Fragment>
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

            <Modal isOpen={ isDeleteModalOpen } entityName={ lists.find((list: ListResponseDto) => list.id === selectedListId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleConfirmDelete } />

            <Drawer isOpen={ isDrawerOpen } formId="list-form" title={ updating ? "Editar lista" : "Nova lista" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <ListForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleReadLists(); } } />
            </Drawer>
        </Fragment>
    );
}

export default Lists;
