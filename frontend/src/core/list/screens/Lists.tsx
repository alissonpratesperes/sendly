import { toast } from 'react-toastify';
import { BadgeAlert } from 'lucide-react';
import { PropagateLoader } from 'react-spinners';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ListForm } from '../forms/listForm.form';
import { List, Delete } from '../services/list.service';
import { ListResponseDto } from '../dtos/listResponse.dto';
import { ListFormData } from '../schemas/listFormSchema.schema';
import { formatDate } from '../../../shared/utils/formatDate.util';
import Modal from '../../../shared/components/modal/screens/Modal';
import { Table } from '../../../shared/components/table/screens/Table';
import { Finder } from '../../../shared/components/finder/screen/Finder';
import * as SharedStyled from '../../../shared/styles/Registration.style';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import * as Styled from '../../../shared/components/table/styles/table.style';
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

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
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
                <Finder placeholder="Pesquise uma lista por nome ou assunto" buttonText="Cadastrar lista" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } } />

                { isLoading && (
                    <SharedStyled.LoadingContainer>
                        <PropagateLoader size={ 25 } color="#1C70E9" />
                    </SharedStyled.LoadingContainer>
                ) }
                { lists.length > 0 ? (
                    <Fragment>
                        <Table<ListResponseDto>
                            headers={[ "Nome", "Assunto", "Cor", "Criada em", "Editada em", ]}
                            data={ lists }
                            getEntityId={ (list: ListResponseDto) => list.id }
                            onEdit={ handleUpdate }
                            onDelete={ (id: number) => { setSelectedListId(id); setIsDeleteModalOpen(true); } }
                            renderEntityRow={ (list: ListResponseDto) => (
                                <Fragment>
                                    <Styled.TableListBodyRowData> <b> { list.name } </b> </Styled.TableListBodyRowData>
                                    <Styled.TableListBodyRowData> { list.subject } </Styled.TableListBodyRowData>
                                    <Styled.TableListBodyRowData> <Styled.TableListColorContent> <Styled.TableListColorFragment $color={ list.color } /> </Styled.TableListColorContent> </Styled.TableListBodyRowData>
                                    <Styled.TableListBodyRowData> { formatDate(list.createdAt, true) } </Styled.TableListBodyRowData>
                                    <Styled.TableListBodyRowData> { formatDate(list.updatedAt, true) } </Styled.TableListBodyRowData>
                                </Fragment>
                            ) }
                        />

                        <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } } />
                    </Fragment>
                ) : !isLoading ? (
                    <SharedStyled.NotFoundRegisterContainer>
                        <BadgeAlert size={ 50 } color="#1C70E9"/>

                        <SharedStyled.NotFoundRegisterText> Nenhum registro encontrado </SharedStyled.NotFoundRegisterText>
                    </SharedStyled.NotFoundRegisterContainer>
                ) : null }

            <Modal isOpen={ isDeleteModalOpen } entityName={ lists.find((list: ListResponseDto) => list.id === selectedListId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleConfirmDelete } />

            <Drawer isOpen={ isDrawerOpen } formId="list-form" title={ updating ? "Editar lista" : "Nova lista" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <ListForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleReadLists(); } } />
            </Drawer>
        </Fragment>
    );
}

export default Lists;
