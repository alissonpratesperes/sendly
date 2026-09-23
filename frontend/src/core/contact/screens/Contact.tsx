import { toast } from 'react-toastify';
import parsePhoneNumberFromString from 'libphonenumber-js';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { ContactForm } from '../forms/contactForm.form';
import { Read } from '../../list/services/list.service';
import { ContactResponseDto } from '../dtos/contactResponse.dto';
import { List, Update, Delete } from '../services/contact.service';
import { formatDate } from '../../../shared/utils/formatDate.util';
import Modal from '../../../shared/components/modal/screens/Modal';
import { ListResponseDto } from '../../list/dtos/listResponse.dto';
import { ContactFormData } from '../schemas/contactFormSchema.schema';
import { Table } from '../../../shared/components/table/screens/Table';
import { Finder } from '../../../shared/components/finder/screen/Finder';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import * as Styled from '../../../shared/components/table/styles/table.style';
import { EmptyState } from '../../../shared/components/emptyState/screens/EmpyState';
import ToggleSwitch from '../../../shared/components/toggleSwitch/screens/ToggleSwitch';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

const Contact = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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
    const handleRead = useCallback(async () => {
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

                setListsNames((previousListsNames: Record<number, ListResponseDto>) => ({ ...previousListsNames, ...newLists, }));
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
    const handleDelete = async () => {
        if (selectedContactId === null) {
            return;
        }

        try {
            await Delete({ id: selectedContactId });

            setIsDeleteModalOpen(false);
            setSelectedContactId(null);

            if (contacts.length === 1 && page > 1) {
                setPage((previousPage: number) => previousPage - 1);
            } else {
                await handleRead();
            }

            toast.success("Contato excluído com suceso");
        } catch (error: unknown) {
            toast.error("Não é possível prosseguir com a solicitação");
        } finally { }
    }
    const handleActiveCommunication = async (id: number, status: boolean) => {
        try {
            const contact = contacts.find((contact: ContactResponseDto) => contact.id === id);

            if (!contact) {
                return;
            }

            await Update({ id: contact.id }, { active: status });

            setContacts((previousContacts: ContactResponseDto[]) => previousContacts.map(contact => (contact.id === id ? { ...contact, active: status } : contact)));
        } catch (error: unknown) {
            toast.error("Não é possível prosseguir com a solicitação");
        } finally { }
    }

    useEffect(() => {
        listsNamesRef.current = listsNames;
    }, [ listsNames ]);
    useEffect(() => {
        const timeout = setTimeout(() => {
            handleRead();
        }, 500);

        return () => clearTimeout(timeout);
    }, [ handleRead ]);

    return (
        <Fragment>
            { isLoading && (
                <LoadingState/>
            ) }
            { !isLoading && (
                <Finder showAddButton={ true } placeholder="Pesquise um contato por nome ou telefone" buttonText="Cadastrar contato" search={ search } onAdd={ handleCreate } onSearchChange={ (value) => { setSearch(value); setPage(1); } } />
            ) }
            { !isLoading && contacts.length > 0 && (
                <Fragment>
                    <Table<ContactResponseDto>
                        headers={[ "Nome", "Telefone", "Comunicação", "Criada em", "Editada em", ]}
                        data={ contacts }
                        getEntityId={ (contact: ContactResponseDto) => contact.id }
                        onEdit={ handleUpdate }
                        onDelete={ (id: number) => { setSelectedContactId(id); setIsDeleteModalOpen(true); } }
                        renderEntityRow={ (contact: ContactResponseDto) => (
                            <Fragment>
                                <Styled.TableListBodyRowData> <Styled.TableListColorContent> <Styled.TableListColorFragment $color={ listsNames[contact.listId]?.color ?? "transparent" }/> { contact.name } </Styled.TableListColorContent> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <b> { parsePhoneNumberFromString(contact.phone)?.formatNational() } </b> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> <ToggleSwitch label={ contact.active ? "Active" : "Inactive" } checked={ contact.active } onChange={ (event) => handleActiveCommunication(contact.id, event.target.checked) } /> </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(contact.createdAt, true) } </Styled.TableListBodyRowData>
                                <Styled.TableListBodyRowData> { formatDate(contact.updatedAt, true) } </Styled.TableListBodyRowData>
                            </Fragment>
                        ) }
                    />

                    <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } } />
                </Fragment>
            ) }
            { !isLoading && contacts.length === 0 && (
                <EmptyState message="Nenhum contato encontrado" />
            ) }

            <Modal isOpen={ isDeleteModalOpen } entityName={ contacts.find((contact: ContactResponseDto) => contact.id === selectedContactId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleDelete } />

            <Drawer isOpen={ isDrawerOpen } isSubmitting={ isSubmitting } formId="contact-form" title={ updating ? "Editar contato" : "Novo contato" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <ContactForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); if (isSubmitting) { return; } setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleRead(); } } onLoadingChange={ setIsSubmitting } />
            </Drawer>
        </Fragment>
    );
}

export default Contact;
