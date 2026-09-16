import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { BadgeAlert, CirclePlus, Search, Trash, Pen } from 'lucide-react';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { CompanyForm } from '../forms/companyForm.form';
import { List, Delete } from '../services/company.service';
import { CompanyResponseDto } from '../dtos/companyResponse.dto';
import { formatDate } from '../../../shared/utils/formatDate.util';
import Modal from '../../../shared/components/modal/screens/Modal';
import { CompanyFormData } from '../schemas/companyFormSchema.schema';
import * as SharedStyled from '../../../shared/styles/Registration.style';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import Paginate from '../../../shared/components/paginate/screens/Paginate';
import { formatCompanyDocument } from '../../../shared/utils/formatCompanyDocument.util';
import { PaginatedQueryDto } from '../../../shared/components/paginate/dtos/paginatedQuery.dto';

const Company = () => {
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(1);
    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [companies, setCompanies] = useState<CompanyResponseDto[]>([]);
    const [updating, setUpdating] = useState<CompanyFormData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

    const handleReadCompanies = useCallback(async () => {
        try {
            setIsLoading(true);

            const params: PaginatedQueryDto = { page, limit, search };
            const response = await List(params);

            setCompanies(response.data);
            setTotal(response.total);
        } catch (error) {
            toast.error(`Erro ao listar Empresas: ${ error }`);
        } finally {
            setIsLoading(false);
        }
    }, [ page, limit, search ]);

    const handleCreate = () => {
        setUpdating(null);
        setIsDrawerOpen(true);
    }
    const handleUpdate = (id: number) => {
        const clicked = companies.find((company: CompanyResponseDto) => company.id === id);

        if (!clicked) {
            return;
        }

        setUpdating({
            id: clicked.id,
            name: clicked.name,
            document: clicked.document,
            description: clicked.description ?? "",
        });
        setIsDrawerOpen(true);
    }
    const handleConfirmDelete = async () => {
        if (selectedCompanyId === null) {
            return;
        }

        try {
            await Delete({ id: selectedCompanyId });

            const isLastItemOnLastPage = companies.length === 1 && page > 1;

            setCompanies((previousCompanies: CompanyResponseDto[]) => previousCompanies.filter((company: CompanyResponseDto) => company.id !== selectedCompanyId));

            if (isLastItemOnLastPage) {
                setPage((previousPage: number) => previousPage - 1);
            } else {
                handleReadCompanies();
            }

            setIsDeleteModalOpen(false);

            toast.success("Empresa excluída com suceso");
        } catch (error: unknown) {
            toast.error(`Não é possível prosseguir com a solicitação: ${ error }`);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleReadCompanies();
        }, 500);

        return () => clearTimeout(timeout);
    }, [ handleReadCompanies ]);

    return (
        <Fragment>
            <SharedStyled.ListWrapper>
                <SharedStyled.SearchInputWrapper>
                    <SharedStyled.SearchInputContainer>
                        <Search size={ 25 } color="#1C70E9" />

                        <SharedStyled.SearchInputField type="text" placeholder="Pesquise uma empresa por nome ou cnpj" value={ search } onChange={ (inputEvent) => { setSearch(inputEvent.target.value); setPage(1); } } />
                    </SharedStyled.SearchInputContainer>

                    <SharedStyled.AddButton onClick={ handleCreate }>
                        <CirclePlus size={ 25 } />

                        <SharedStyled.SearchInputSubmitText> Cadastrar empresa </SharedStyled.SearchInputSubmitText>
                    </SharedStyled.AddButton>
                </SharedStyled.SearchInputWrapper>

                { isLoading && (
                    <SharedStyled.LoadingContainer>
                        <PropagateLoader size={ 25 } color="#1C70E9" />
                    </SharedStyled.LoadingContainer>
                ) }
                { companies.length > 0 ? (
                    <Fragment>
                        <SharedStyled.TableWrapper>
                            <SharedStyled.TableListWrapper>
                                <thead>
                                    <SharedStyled.TableListHeaderRow>
                                        <SharedStyled.TableListHeaderRowColumn> Nome </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> CNPJ </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> Descrição </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> Criada em </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> Editada em </SharedStyled.TableListHeaderRowColumn>
                                        <SharedStyled.TableListHeaderRowColumn> </SharedStyled.TableListHeaderRowColumn>
                                    </SharedStyled.TableListHeaderRow>
                                </thead>
                                <tbody>
                                    { companies.map((company: CompanyResponseDto) => (
                                        <SharedStyled.TableListBodyRow key={ company.id }>
                                            <SharedStyled.TableListBodyRowData> { company.name } </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData> <b> { formatCompanyDocument(company.document) } </b> </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData> { company.description } </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData> { formatDate(company.createdAt, true) } </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData> { formatDate(company.updatedAt, true) } </SharedStyled.TableListBodyRowData>
                                            <SharedStyled.TableListBodyRowData>
                                                <SharedStyled.TableListBodyRowDataActions>
                                                    <SharedStyled.TableListBodyRowDataActionButton onClick={ () => handleUpdate(company.id) }> <Pen size={ 25 } color="#238636" /> </SharedStyled.TableListBodyRowDataActionButton>
                                                    <SharedStyled.TableListBodyRowDataActionButton onClick={ () => { setSelectedCompanyId(company.id); setIsDeleteModalOpen(true); } }> <Trash size={ 25 } color="#DC143C" /> </SharedStyled.TableListBodyRowDataActionButton>
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

            <Modal isOpen={ isDeleteModalOpen } entityName={ companies.find((company: CompanyResponseDto) => company.id === selectedCompanyId)?.name ?? " " } onClose={ () => setIsDeleteModalOpen(false) } onConfirm={ handleConfirmDelete } />

            <Drawer isOpen={ isDrawerOpen } formId="company-form" title={ updating ? "Editar empresa" : "Nova empresa" } mode={ updating ? "edit" : "create" } onClose={ () => { setIsDrawerOpen(false); setUpdating(null); } }>
                <CompanyForm initialValues={ updating ?? undefined } onCancel={ () => { setIsDrawerOpen(false); setUpdating(null); } } onSubmit={ () => { setIsDrawerOpen(false); setUpdating(null); handleReadCompanies(); } } />
            </Drawer>
        </Fragment>
    );
}

export default Company;
