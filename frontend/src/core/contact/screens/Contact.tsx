import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { BadgeAlert, CirclePlus, Search, Trash, Pen } from 'lucide-react';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { ContactForm } from '../forms/contactForm.form';
import { Read } from '../../list/services/list.service';
import { List, Delete } from '../services/contact.service';
import { ContactResponseDto } from '../dtos/contactResponse.dto';
import { formatDate } from '../../../shared/utils/formatDate.util';
import Modal from '../../../shared/components/modal/screens/Modal';
import { ListResponseDto } from '../../list/dtos/listResponse.dto';
import { ContactFormData } from '../schemas/contactFormSchema.schema';
import * as SharedStyled from '../../../shared/styles/Registration.style';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

const Contact = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(1);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [contacts, setContacts] = useState<ContactResponseDto[]>([]);
    const [updating, setUpdating] = useState<ContactFormData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
    const [listsNames, setListsNames] = useState<Record<number, ListResponseDto>>({});

    const listsNamesRef = useRef<Record<number, ListResponseDto>>({});

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
    const handleReadContacts = useCallback(async () => {
        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search };
            const response = await List(params);

            setContacts(response.data);
            setTotal(response.total);

            const uniqueListsIds = Array.from(new Set(response.data.map((list: ContactResponseDto) => list.listId)));
            const missingListsIds = uniqueListsIds.filter((id: number) => !listsNamesRef.current[id]);

            if (missingListsIds.length > 0) {
                const responses = await Promise.all(
                    missingListsIds.map(async (id: number) => {
                        try {
                            return await Read({ id });
                        } catch {
                            return null;
                        }
                    })
                );

                const newLists: Record<number, ListResponseDto> = {};

                responses.forEach((list) => {
                    if (list) {
                        newLists[list.id] = list;
                    }
                });

                setListsNames((previousListsNames) => ({
                    ...previousListsNames,
                    ...newLists
                }));
            }
        } catch (error) {
            toast.error(`Erro ao listar Contatos: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search ]);
    const handleUpdate = (id: number) => {
        const clicked = contacts.find((contact: ContactResponseDto) => contact.id === id);

        if (!clicked) {
            return;
        }

        const parsedPhone = parsePhoneNumberFromString(clicked.phone);

        setUpdating({
            id: clicked.id,
            companyId: clicked.companyId,
            listId: clicked.listId,
            name: clicked.name,
            phone: clicked.phone,
            country: parsedPhone?.country ?? ""
        });

        setIsDrawerOpen(true);
    }
    const handleConfirmDelete = async () => {
        if (selectedContactId === null) {
            return;
        }

        try {
            await Delete({ id: selectedContactId });

            const isLastItemOnLastPage = contacts.length === 1 && page > 1;

            setContacts((previousContacts: ContactResponseDto[]) => previousContacts.filter((contact: ContactResponseDto) => contact.id !== selectedContactId));

            if (isLastItemOnLastPage) {
                setPage((previousPage: number) => previousPage - 1);
            } else {
                handleReadContacts();
            }

            setIsDeleteModalOpen(false);

            toast.success("Contato excluído com suceso");
        } catch (error: unknown) {
            toast.error(`Não é possível prosseguir com a solicitação: ${ error }`);
        }
    }

    useEffect(() => {
        listsNamesRef.current = listsNames;
    }, [ listsNames ]);
    useEffect(() => {
        const timeout = setTimeout(() => {
            handleReadContacts();
        }, 500);

        return () => clearTimeout(timeout);
    }, [ handleReadContacts ]);

    return (
        <Fragment>
            <SharedStyled.ListWrapper>
                <SharedStyled.SearchInputWrapper>
                    <SharedStyled.SearchInputContainer>
                        <Search size={ 25 } color="#1C70E9" />

                        <SharedStyled.SearchInputField type="text" placeholder="Pesquise um contato por nome ou telefone" value={ search } onChange={ (inputEvent) => { setSearch(inputEvent.target.value); setPage(1); } } />
                    </SharedStyled.SearchInputContainer>

                    <SharedStyled.AddButton onClick={ handleCreate }>
                        <CirclePlus size={ 25 } />

                        <SharedStyled.SearchInputSubmitText> Cadastrar contato </SharedStyled.SearchInputSubmitText>
                    </SharedStyled.AddButton>
                </SharedStyled.SearchInputWrapper>

                { isLoading && (
                    <SharedStyled.LoadingContainer>
                        <PropagateLoader size={ 25 } color="#1C70E9" />
                    </SharedStyled.LoadingContainer>
                ) }
                { contacts.length > 0 ? (
                    <Fragment>
                        <SharedStyled.TableWrapper>
                            <SharedStyled.TableListWrapper>
                                <thead>
                                    <SharedStyled.TableListHeaderRow>
                                        <SharedStyled.TableListHeaderRowColumn> Nome </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> Telefone </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> Criada em </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> Editada em </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> </SharedStyled.TableListHeaderRowColumn>
                                    </SharedStyled.TableListHeaderRow>
                                </thead>
                                <tbody>
                                    { contacts.map((contact: ContactResponseDto) => (
                                        <SharedStyled.TableListBodyRow key={ contact.id }>
                                            <SharedStyled.TableListBodyRowData> <SharedStyled.TableListColorContent> <SharedStyled.TableListColorFragment $color={ listsNames[contact.listId]?.color ?? "transparent" }/> { contact.name } </SharedStyled.TableListColorContent> </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData> <b> { parsePhoneNumberFromString(contact.phone)?.formatNational() } </b> </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData> { formatDate(contact.createdAt, true) } </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData> { formatDate(contact.updatedAt, true) } </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData>
                                                <SharedStyled.TableListBodyRowDataActions>
                                                    <SharedStyled.TableListBodyRowDataActionButton onClick={ () => handleUpdate(contact.id) }> <Pen size={ 25 } color="#238636"/> </SharedStyled.TableListBodyRowDataActionButton>
                                                    <SharedStyled.TableListBodyRowDataActionButton onClick={ () => { setSelectedContactId(contact.id); setIsDeleteModalOpen(true); } }> <Trash size={ 25 } color="#DC143C" /> </SharedStyled.TableListBodyRowDataActionButton>
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
                    <SharedStyled.NotFoundRegisterContainer>
                        <BadgeAlert size={ 50 } color="#1C70E9"/>

                        <SharedStyled.NotFoundRegisterText> Nenhum registro encontrado </SharedStyled.NotFoundRegisterText>
                    </SharedStyled.NotFoundRegisterContainer>
                ) : null }
            </SharedStyled.ListWrapper>

            <Modal isOpen={ isDeleteModalOpen } entityName={ contacts.find((contact: ContactResponseDto) => contact.id === selectedContactId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleConfirmDelete } />

            <Drawer isOpen={ isDrawerOpen } formId="contact-form" title={ updating ? "Editar contato" : "Novo contato" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <ContactForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleReadContacts(); } } />
            </Drawer>
        </Fragment>
    );
}

export default Contact;
