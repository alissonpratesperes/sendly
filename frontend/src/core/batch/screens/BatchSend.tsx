import { toast } from 'react-toastify';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import * as S from '../../../shared/components/table/styles/table.style';

import { List, ListSends } from '../services/batch.service';
import { BatchResponseDto } from '../dtos/batchResponse.dto';
import { Read } from '../../contact/services/contact.service';
import { BatchSendStatus } from '../enums/batchSendStatus.enum';
import { formatDate } from '../../../shared/utils/formatDate.util';
import { BatchSendResponseDto } from '../dtos/batchSendResponse.dto';
import { TemplateForm } from '../../template/forms/templateForm.form';
import { Table } from '../../../shared/components/table/screens/Table';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import { ContactResponseDto } from '../../contact/dtos/contactResponse.dto';
import { Paginate } from '../../../shared/components/paginate/screens/Paginate';
import { Dropdown } from '../../../shared/components/dropdown/screens/Dropdown';
import { TemplateFormData } from '../../template/schemas/templateFormSchema.schema';
import { EmptyState } from '../../../shared/components/emptyState/screens/EmpyState';
import { LoadingState } from '../../../shared/components/loadingState/screens/LoadingState';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

export const BatchSend = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [batches, setBatches] = useState<BatchResponseDto[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const contactsNamesRef = useRef<Record<number, ContactResponseDto>>({});
    const [batchSends, setBatchSends] = useState<BatchSendResponseDto[]>([]);
    const [isBatchesLoading, setIsBatchesLoading] = useState<boolean>(false);
    const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
    const [viewingBatchSend, setViewingBatchSend] = useState<TemplateFormData | null>(null);
    const [contactsNames, setContactsNames] = useState<Record<number, ContactResponseDto>>({});
    const [selectedBatchSendStatus, setSelectedBatchSendStatus] = useState<BatchSendStatus | null>(null);

    const optionsForBatchSendStatus = [
        { value: BatchSendStatus.WAITING, label: "Aguardando" },
        { value: BatchSendStatus.PROCESSING, label: "Processando" },
        { value: BatchSendStatus.SENT, label: "Enviado" },
        { value: BatchSendStatus.ERROR, label: "Falhado" },
    ];
    const optionsForBatches = batches
        .filter((batch: BatchResponseDto) => batch.id !== undefined && batch.id !== null)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((batch: BatchResponseDto) => ({ value: Number(batch.id), label: batch.name, }));

    const handleRead = useCallback(async () => {
        if (selectedBatchId === null) {
            setBatchSends([]);
            setTotal(0);

            return;
        }

        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search, status: selectedBatchSendStatus ?? undefined, };
            const response = await ListSends({ id: selectedBatchId }, params);

            setBatchSends(response.data);
            setTotal(response.total);

            const uniqueContactsIds = Array.from(new Set(response.data.map((batchSend: BatchSendResponseDto) => batchSend.contactId)));
            const missingContactsIds = uniqueContactsIds.filter((id: number) => !contactsNamesRef.current[id]);

            if (missingContactsIds.length > 0) {
                const responses = await Promise.all(
                    missingContactsIds.map(async (id: number) => {
                        try {
                            return await Read({ id });
                        } catch {
                            return null;
                        }
                    })
                );

                const newContacts: Record<number, ContactResponseDto> = {};

                responses.forEach((contact) => {
                    if (contact) {
                        newContacts[contact.id] = contact;
                    }
                });

                setContactsNames((previous) => ({ ...previous, ...newContacts, }));

                contactsNamesRef.current = { ...contactsNamesRef.current, ...newContacts, };
            }
        } catch (error) {
            toast.error(`Erro ao listar Envios: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ selectedBatchId, page, limit, selectedBatchSendStatus ]);

    const handleViewBatchSend = (id: number) => {
        const clicked = batchSends.find((batchSend: BatchSendResponseDto) => batchSend.id === id);

        if (!clicked) {
            return;
        }

        setViewingBatchSend({
            id: clicked.id,
            companyId: clicked.companyId,
            name: clicked.templateSnapshot.name,
            content: clicked.templateSnapshot.content,
        });
        setIsDrawerOpen(true);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleRead();
        }, 500);

        return () => clearTimeout(timeout);
    }, [ handleRead, ]);
    useEffect(() => {
        const progressiveBatchesFetch = async () => {
            try {
                setIsBatchesLoading(true);

                const fetchAllBatches = async () => {
                    let page = 1;
                    let totalPages = 0;
                    let allFetchedBatches: BatchResponseDto[] = [];

                    do {
                        const response = await List({ page, limit, search, });

                        allFetchedBatches = [ ...allFetchedBatches, ...response.data ];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setBatches(allFetchedBatches);
                }

                await fetchAllBatches();
            } catch (error) {
                toast.error(`Erro ao listar as opções de Lotes: ${ error }`);
            } finally {
                setIsBatchesLoading(false);
            }
        }

        progressiveBatchesFetch();
    }, []);

    return (
        <Fragment>
            { isLoading && (
                <LoadingState/>
            ) }
            { !isLoading && (
                <S.WhenInMultiSearchContainer>
                    <S.WhenInAnotherScreenWrapper>
                        <Dropdown
                            inputId="batchStatusId"
                            isInBatchSendScreen={ true }
                            isSearchable={ false }
                            isClearable={ true }
                            options={ optionsForBatchSendStatus }
                            placeholder="Filtre por status"
                            value={ optionsForBatchSendStatus.find((option) => option.value === selectedBatchSendStatus) ?? null }
                            onChange={ (selectedOption) => { setSelectedBatchSendStatus(selectedOption?.value ?? null); setPage(1); } }
                        />
                    </S.WhenInAnotherScreenWrapper>
                    <S.WhenInAnotherScreenWrapper>
                        <Dropdown
                            inputId="batchId"
                            isInBatchSendScreen={ true }
                            isLoading={ isBatchesLoading }
                            isClearable={ true }
                            options={ optionsForBatches }
                            placeholder="Filtre por lote"
                            value={ optionsForBatches.find((option) => option.value === selectedBatchId) ?? null }
                            onChange={ (selectedOption) => { setSelectedBatchId(selectedOption?.value ?? null); setBatchSends([]); setTotal(0); setPage(1); } }
                        />
                    </S.WhenInAnotherScreenWrapper>
                </S.WhenInMultiSearchContainer>
            ) }
            { !isLoading && batchSends.length > 0 && (
                <Fragment>
                    <Table<BatchSendResponseDto>
                        headers={[ "Contato", "Agendamento", "Execução", "Atualização", ]}
                        data={ batchSends }
                        getEntityId={ (batchSend: BatchSendResponseDto) => batchSend.id }
                        onView={ handleViewBatchSend }
                        renderEntityRow={ (batchSend: BatchSendResponseDto) => (
                            <Fragment>
                                <S.TableListBodyRowData> { contactsNames[batchSend.contactId]?.name ?? "" } </S.TableListBodyRowData>
                                <S.TableListBodyRowData> <S.TimeStampDestak> { formatDate(batchSend.scheduledAt, false) } </S.TimeStampDestak> </S.TableListBodyRowData>
                                <S.TableListBodyRowData> <S.TimeStampsContainer> <S.TimeStampsRowContent> <b> Início: </b> <S.TimeStampDestak> { batchSend.startedAt ? formatDate(batchSend.startedAt, false) : "-" } </S.TimeStampDestak> </S.TimeStampsRowContent> { batchSend.startedAt && !batchSend.completedAt ? <S.TimeStampsRowContent> <LoadingState isInBatchFlowScreens={ true }/> </S.TimeStampsRowContent> : <S.TimeStampsRowContent> <b> Fim: </b> <S.TimeStampDestak> { batchSend.completedAt ? formatDate(batchSend.completedAt, false) : "-" } </S.TimeStampDestak> </S.TimeStampsRowContent> } </S.TimeStampsContainer> </S.TableListBodyRowData>
                                <S.TableListBodyRowData> <S.TimeStampDestak $statusColor={ batchSend.status } title={ batchSend.errorMessage?.trim() || undefined }> { formatDate(batchSend.updatedAt, false) } </S.TimeStampDestak> </S.TableListBodyRowData>
                            </Fragment>
                        ) }
                        canView={ true }
                        canEdit={ false }
                        canDelete={ false }
                    />

                    <Paginate page={ page } total={ total } limit={ limit } onPageChange={ setPage } onLimitChange={ (newLimit: number) => { setLimit(newLimit); setPage(1); } }/>
                </Fragment>
            ) }
            { !isLoading && batchSends.length === 0 && (
                <EmptyState message={ selectedBatchId === null ? "Selecione um lote para carregar os envios" : "Nenhum envio encontrado para os filtros selecionados" }/>
            ) }

            <Drawer isOpen={ isDrawerOpen } isSubmitting={ isSubmitting } formId="batch-form" title={ "Template enviado" } mode={ viewingBatchSend ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setViewingBatchSend(null); } } hideFooter={ true }>
                <TemplateForm initialValues={ viewingBatchSend ?? undefined } onCancel={ () => { setIsDrawerOpen(false); if (isSubmitting) { return; } setViewingBatchSend(null); } } onSubmit={ () => { setIsDrawerOpen(false); setViewingBatchSend(null); handleRead(); } } onLoadingChange={ setIsSubmitting } disabled={ true }/>
            </Drawer>
        </Fragment>
    );
}
