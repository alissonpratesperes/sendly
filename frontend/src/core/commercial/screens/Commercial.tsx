import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import Select, { components, MultiValue } from 'react-select';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Search, MoveLeft, ChevronLeft, ChevronRight } from 'lucide-react';

import { Read } from '../services/Commercial.service';
import { CommercialForm } from '../forms/CommercialForm';
import { ChainDTO } from '../../chain/dtos/ChainDTO.dto';
import { StoreDTO } from '../../store/dtos/StoreDTO.dto';
import { CommercialDTO } from '../dtos/CommercialDTO.dto';
import { ActionDTO } from '../../action/dtos/ActionDTO.dto';
import * as CommercialStyled from '../styles/Commercial.style';
import { CategoryDTO } from '../../category/dtos/CategoryDTO.dto';
import Toast from '../../../shared/components/toast/screens/Toast';
import EmptyStateVector from '../../../assets/emptystate_vector.svg';
import Card from '../../../shared/components/commercial/screens/Card';
import { Read as ReadChains } from '../../chain/services/Chain.service';
import { Read as ReadStores } from '../../store/services/Store.service';
import * as SharedStyled from '../../../shared/styles/Registration.style';
import { Read as ReadActions } from '../../action/services/Action.service';
import { ReadById as ReadAction } from '../../action/services/Action.service';
import { Read as ReadCategories } from '../../category/services/Category.service';
import Pagination from '../../../shared/components/pagination/screens/Pagination';
import { GenericDrawer } from '../../../shared/components/drawer/screens/GenericDrawer';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';

const Commercial = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [pageSize, setPageSize] = useState<number>(6);
    const [stores, setStores] = useState<StoreDTO[]>([]);
    const [chains, setChains] = useState<ChainDTO[]>([]);
    const [actions, setActions] = useState<ActionDTO[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [commercials, setCommercials] = useState<CommercialDTO[]>([]);
    const [formFilterData, setFormFilterData] = useState<{ dates: [Date | null, Date | null]; actionsIds: number[]; chainsIds: number[]; storesIds: number[]; categoriesIds: number[]; productsIds: number[]; }>({ dates: [null, null], actionsIds: [], chainsIds: [], storesIds: [], categoriesIds: [], productsIds: [] });
    const [appliedFilters, setAppliedFilters] = useState(formFilterData);
    const [actionNames, setActionNames] = useState<Record<number, string>>({});
    const actionNamesRef = useRef(actionNames);

    const { showLoading, hideLoading } = useLoading();

    const optionsForActions = actions.filter(action => action.id !== undefined && action.id !== null && action.ativo).map(action => ({ value: Number(action.id), label: action.nome }));
    const optionsForChains = chains.filter(chain => chain.id !== undefined && chain.id !== null && chain.ativo).map(chain => ({ value: Number(chain.id), label: chain.nome })).sort((a, b) => a.label.localeCompare(b.label));

    const filteredStores = formFilterData.chainsIds.length > 0 ? stores.filter(store => formFilterData.chainsIds.includes(store.redeId ?? -1)) : stores;
    const optionsForStores = filteredStores.filter(store => store.id !== undefined && store.id !== null && store.ativo).map(store => ({ value: Number(store.id), label: store.apelido })).sort((a, b) => a.label.localeCompare(b.label));

    const optionsForCategories = categories.filter(category => category.id !== undefined && category.id !== null && category.ativo).map(category => ({ value: Number(category.id), label: category.nome })).sort((a, b) => a.label.localeCompare(b.label));

    const CustomDateInput = React.forwardRef<HTMLInputElement, any>(({ value, onClick }, ref) => (<SharedStyled.DateInput readOnly onClick={onClick} ref={ref} value={value} placeholder="DD/MM/AAAA - DD/MM/AAAA" />));

    const isAllChainsSelected = formFilterData.chainsIds.length === optionsForChains.length;
    const isAllStoresSelected = formFilterData.storesIds.length === optionsForStores.length;
    const isAllActionsSelected = formFilterData.actionsIds.length === optionsForActions.length;
    const isAllCategoriesSelected = formFilterData.categoriesIds.length === optionsForCategories.length;

    const toggleSelectAllChains = () => { setFormFilterData(previousValue => ({ ...previousValue, chainsIds: isAllChainsSelected ? [] : optionsForChains.map(chain => Number(chain.value)) })); };
    const toggleSelectAllStores = () => { setFormFilterData(previousValue => ({ ...previousValue, storesIds: isAllStoresSelected ? [] : optionsForStores.map(store => Number(store.value)) })); };
    const toggleSelectAllActions = () => { setFormFilterData(previousValue => ({ ...previousValue, actionsIds: isAllActionsSelected ? [] : optionsForActions.map(action => Number(action.value)) })); };
    const toggleSelectAllCategories = () => { setFormFilterData(previousValue => ({ ...previousValue, categoriesIds: isAllCategoriesSelected ? [] : optionsForCategories.map(category => Number(category.value)) })); };

    const CustomOptionsContainer = ({ data, isSelected, innerRef, innerProps }: { data: { label: string }; isSelected: boolean; innerRef: React.Ref<HTMLDivElement>; innerProps: any; }) => (
        <SharedStyled.CustomOptionsContainer ref={innerRef} {...innerProps}>
            <SharedStyled.CustomOptionsInput type="checkbox" checked={isSelected} readOnly />

            {data.label}
        </SharedStyled.CustomOptionsContainer>
    );
    const SelectAllCheckbox = ({ isAllSelected, toggleAll, label }: { isAllSelected: boolean, toggleAll: () => void, label: string }) => (
        <SharedStyled.CustomOptionsDiv>
            <SharedStyled.CustomSelectedAllLabel>
                <SharedStyled.CustomSelectedAllInput type="checkbox" checked={isAllSelected} onChange={toggleAll} />

                {label}
            </SharedStyled.CustomSelectedAllLabel>
        </SharedStyled.CustomOptionsDiv>
    );
    const CustomMenuList = (props: any) => {
        const { children, selectProps: { isAllSelected, toggleAll, label } } = props;

        return (
            <>
                <SelectAllCheckbox isAllSelected={isAllSelected} toggleAll={toggleAll} label={label} />

                <components.MenuList {...props}> {children} </components.MenuList>
            </>
        );
    };
    const handleCreate = () => {
        setDrawerOpen(true);
    };
    const handleRead = useCallback(async () => {
        try {
            showLoading();

            let startOfDayUTC: Date | undefined;
            let endOfDayUTC: Date | undefined;

            if (appliedFilters.dates[0]) {
                startOfDayUTC = new Date(Date.UTC(appliedFilters.dates[0].getFullYear(), appliedFilters.dates[0].getMonth(), appliedFilters.dates[0].getDate(), 0, 0, 0, 0));
            };
            if (appliedFilters.dates[1]) {
                endOfDayUTC = new Date(Date.UTC(appliedFilters.dates[1].getFullYear(), appliedFilters.dates[1].getMonth(), appliedFilters.dates[1].getDate(), 23, 59, 59, 999));
            };

            const params: PaginatedRequestDTO & { dataInicial?: string; dataFinal?: string; tiposAcaoIds?: number[]; redesIds?: number[]; lojasIds?: number[]; categoriasProdutosIds?: number[]; produtosIds?: number[]; } = {
                page,
                pageSize,
                sortBy: 'id',
                sortDir: 'desc',
                search,
                dataInicial: startOfDayUTC ? startOfDayUTC.toISOString() : undefined,
                dataFinal: endOfDayUTC ? endOfDayUTC.toISOString() : undefined,
                tiposAcaoIds: appliedFilters.actionsIds.length > 0 ? appliedFilters.actionsIds : undefined,
                redesIds: appliedFilters.chainsIds.length > 0 ? appliedFilters.chainsIds : undefined,
                lojasIds: appliedFilters.storesIds.length > 0 ? appliedFilters.storesIds : undefined,
                categoriasProdutosIds: appliedFilters.categoriesIds.length > 0 ? appliedFilters.categoriesIds : undefined,
                produtosIds: appliedFilters.productsIds.length > 0 ? appliedFilters.productsIds : undefined
            };
            const response = await Read(params);

            setCommercials(response.items);
            setTotalPages(response.totalPages);

            const uniqueActionIds = Array.from(new Set(response.items.map(commercial => commercial.tipoAcaoId).filter(Boolean)));
            const missingActionIds = uniqueActionIds.filter(id => !actionNamesRef.current[id]);

            if (missingActionIds.length > 0) {
                const responses = await Promise.all(missingActionIds.map(id => ReadAction(id).then(response => ({ id, nome: response.nome })).catch(() => null)));
                const newActions: Record<number, string> = {};

                for (const response of responses) {
                    if (response) {
                        newActions[response.id] = response.nome;
                    };
                };

                setActionNames(previousActionNames => ({ ...previousActionNames, ...newActions }));
            };
        } catch (error) {
            toast.error(`Erro ao listar as Ações Comerciais: ${error}`);
        } finally {
            hideLoading();
        };
    }, [page, pageSize, search, appliedFilters, showLoading, hideLoading]);
    const handleDateChange = (date: [Date | null, Date | null]) => {
        const [start, end] = date;

        if (start && end && start > end) {
            toast.error(<Toast errors={[{ message: 'A data de início não pode ser posterior à data de fim' } as any]} />);

            return;
        };

        const adjustedStart = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0) : null;
        const adjustedEnd = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null;

        setFormFilterData(prev => ({ ...prev, dates: [adjustedStart, adjustedEnd] }));
    };
    const handleClearFilters = () => {
        setFormFilterData({ dates: [null, null], actionsIds: [], chainsIds: [], storesIds: [], categoriesIds: [], productsIds: [] });

        handleRead();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchAllActions = async () => {
                    let page = 1;
                    let totalPages = 1;
                    let allActions: ActionDTO[] = [];

                    do {
                        const response = await ReadActions({ page, pageSize: 100, sortBy: 'id', sortDir: 'desc', search: '' });

                        allActions = [...allActions, ...response.items];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setActions(allActions);
                };
                const fetchAllChains = async () => {
                    let page = 1;
                    let totalPages = 1;
                    let allChains: ChainDTO[] = [];

                    do {
                        const response = await ReadChains({ page, pageSize: 100, sortBy: 'id', sortDir: 'desc', search: '' });

                        allChains = [...allChains, ...response.items];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setChains(allChains);
                };
                const fetchAllStores = async () => {
                    let page = 1;
                    let totalPages = 1;
                    let allStores: StoreDTO[] = [];

                    do {
                        const response = await ReadStores({ page, pageSize: 100, sortBy: 'id', sortDir: 'desc', search: '' });

                        allStores = [...allStores, ...response.items];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setStores(allStores);
                };
                const fetchAllCategories = async () => {
                    let page = 1;
                    let totalPages = 1;
                    let allCategories: CategoryDTO[] = [];

                    do {
                        const response = await ReadCategories({ page, pageSize: 100, sortBy: 'id', sortDir: 'desc', search: '' });

                        allCategories = [...allCategories, ...response.items];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setCategories(allCategories);
                };

                await fetchAllActions();
                await fetchAllChains();
                await fetchAllStores();
                await fetchAllCategories();
            } catch (error) {
                toast.error(`Erro ao listar as opções de filtragem: ${error}`);
            };
        };

        fetchData();
    }, []);
    useEffect(() => {
        actionNamesRef.current = actionNames;
    }, [actionNames]);
    useEffect(() => {
        const timeout = setTimeout(() => {
            handleRead();
        }, 250);

        return () => clearTimeout(timeout);
    }, [handleRead]);

    return (
        <>
            <CommercialStyled.HeaderWrapper>
                <CommercialStyled.GoBackButton onClick={() => navigate(-1)}>
                    <MoveLeft size={20} />

                    <CommercialStyled.GoBackButtonLabel> Voltar </CommercialStyled.GoBackButtonLabel>
                </CommercialStyled.GoBackButton>

                <CommercialStyled.SessionInformationWrapper>
                    <CommercialStyled.SessionTitle> Ações comerciais </CommercialStyled.SessionTitle>

                    <CommercialStyled.SessionSubtitle> Cadastre, visualize e gerencie suas ações comerciais </CommercialStyled.SessionSubtitle>
                </CommercialStyled.SessionInformationWrapper>
            </CommercialStyled.HeaderWrapper>

            <SharedStyled.ListWrapper>
                <SharedStyled.SearchInputWrapper>
                    <SharedStyled.SearchInputContainer>
                        <Search size={20} />

                        <SharedStyled.SearchInputField type="text" placeholder="Pesquisar ação comercial" value={search} onChange={(inputEvent) => { setSearch(inputEvent.target.value); setPage(1); }} />
                    </SharedStyled.SearchInputContainer>

                    <SharedStyled.AddButton onClick={handleCreate}>
                        <Plus size={20} />

                        <SharedStyled.SearchInputSubmitText> Cadastrar ação </SharedStyled.SearchInputSubmitText>
                    </SharedStyled.AddButton>
                </SharedStyled.SearchInputWrapper>

                <CommercialStyled.ContentWrapper>
                    <CommercialStyled.FilterCardContainer>
                        <CommercialStyled.FilterCard>
                            <CommercialStyled.FilterCardTitles>
                                <CommercialStyled.FilterCardMainTitle> Filtros </CommercialStyled.FilterCardMainTitle>

                                <CommercialStyled.ClearFilters onClick={handleClearFilters}> Limpar filtros </CommercialStyled.ClearFilters>
                            </CommercialStyled.FilterCardTitles>

                            <SharedStyled.FieldWrapper>
                                <SharedStyled.Label htmlFor="datePicker"> Data </SharedStyled.Label>

                                <SharedStyled.CustomDatePickerWrapper>
                                    <DatePicker
                                        selectsRange
                                        dateFormat="dd/MM/yyyy"
                                        onChange={handleDateChange}
                                        endDate={formFilterData.dates[1]}
                                        customInput={<CustomDateInput />}
                                        dayClassName={() => "custom-day"}
                                        calendarClassName="custom-calendar"
                                        startDate={formFilterData.dates[0]}
                                        wrapperClassName="custom-datepicker-wrapper"
                                        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                            <div className="custom-header">
                                                <button className="nav-button prev" onClick={decreaseMonth}> <ChevronLeft size={18} /> </button>

                                                <span className="header-month"> {date.toLocaleString('pt-BR', { month: 'long' })} </span>

                                                <button className="nav-button next" onClick={increaseMonth}> <ChevronRight size={18} /> </button>
                                            </div>
                                        )}
                                    />
                                </SharedStyled.CustomDatePickerWrapper>
                            </SharedStyled.FieldWrapper>

                            <SharedStyled.FieldWrapper>
                                <SharedStyled.Label htmlFor="acaoId"> Tipo da ação </SharedStyled.Label>

                                <Select
                                    isMulti
                                    inputId="acaoId"
                                    menuPosition="fixed"
                                    closeMenuOnSelect={false}
                                    options={optionsForActions}
                                    hideSelectedOptions={false}
                                    label="Todos os tipos de ação"
                                    menuPortalTarget={document.body}
                                    placeholder="Todos os tipos de ação"
                                    styles={CommercialStyled.SelectCommonStyles}
                                    {...{ isAllSelected: isAllActionsSelected, toggleAll: toggleSelectAllActions } as any}
                                    value={optionsForActions.filter(option => formFilterData.actionsIds.includes(option.value))}
                                    components={{ Option: CustomOptionsContainer, MenuList: CustomMenuList, IndicatorSeparator: () => null }}
                                    onChange={(selectedOptions: { value: number; label: string }[] | null) => setFormFilterData(prev => ({ ...prev, actionsIds: selectedOptions ? selectedOptions.map(option => Number(option.value)) : [] }))}
                                />
                            </SharedStyled.FieldWrapper>
                            <SharedStyled.FieldWrapper>
                                <SharedStyled.Label htmlFor="redeId"> Rede </SharedStyled.Label>

                                <Select
                                    isMulti
                                    inputId="redeId"
                                    menuPosition="fixed"
                                    label="Todas as redes"
                                    closeMenuOnSelect={false}
                                    options={optionsForChains}
                                    hideSelectedOptions={false}
                                    placeholder="Todas as redes"
                                    menuPortalTarget={document.body}
                                    styles={CommercialStyled.SelectCommonStyles}
                                    {...{ isAllSelected: isAllChainsSelected, toggleAll: toggleSelectAllChains } as any}
                                    value={optionsForChains.filter(option => formFilterData.chainsIds.includes(option.value))}
                                    components={{ Option: CustomOptionsContainer, MenuList: CustomMenuList, IndicatorSeparator: () => null }}
                                    onChange={(selectedOptions: { value: number; label: string }[] | null) => setFormFilterData(prev => ({ ...prev, chainsIds: selectedOptions ? selectedOptions.map(option => Number(option.value)) : [] }))}
                                />
                            </SharedStyled.FieldWrapper>
                            <SharedStyled.FieldWrapper>
                                <SharedStyled.Label htmlFor="lojaId"> Loja </SharedStyled.Label>

                                <Select
                                    isMulti
                                    inputId="lojaId"
                                    menuPosition="fixed"
                                    label="Todas as lojas"
                                    closeMenuOnSelect={false}
                                    options={optionsForStores}
                                    hideSelectedOptions={false}
                                    placeholder="Todas as lojas"
                                    menuPortalTarget={document.body}
                                    styles={CommercialStyled.SelectCommonStyles}
                                    {...{ isAllSelected: isAllStoresSelected, toggleAll: toggleSelectAllStores } as any}
                                    value={optionsForStores.filter(option => formFilterData.storesIds.includes(option.value))}
                                    components={{ Option: CustomOptionsContainer, MenuList: CustomMenuList, IndicatorSeparator: () => null }}
                                    onChange={(selectedOptions: { value: number; label: string }[] | null) => setFormFilterData(prev => ({ ...prev, storesIds: selectedOptions ? selectedOptions.map(option => Number(option.value)) : [] }))}
                                />
                            </SharedStyled.FieldWrapper>
                            <SharedStyled.FieldWrapper>
                                <SharedStyled.Label htmlFor="categoriaProdutoId"> Categoria de produto </SharedStyled.Label>

                                <Select
                                    isMulti
                                    menuPosition="fixed"
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    inputId="categoriaProdutoId"
                                    options={optionsForCategories}
                                    menuPortalTarget={document.body}
                                    placeholder="Selecione a categoria"
                                    label="Todas as categorias de produto"
                                    styles={CommercialStyled.SelectCommonStyles}
                                    {...{ isAllSelected: isAllCategoriesSelected, toggleAll: toggleSelectAllCategories } as any}
                                    value={optionsForCategories.filter(option => formFilterData.categoriesIds.includes(option.value))}
                                    components={{ Option: CustomOptionsContainer, MenuList: CustomMenuList, IndicatorSeparator: () => null }}
                                    onChange={(selectedOptions: MultiValue<{ value: number; label: string }>) => {
                                        const newCategoryIds = selectedOptions ? selectedOptions.map(option => option.value) : [];

                                        setFormFilterData(prev => ({ ...prev, categoriesIds: newCategoryIds, productsIds: [] }));
                                    }}
                                />
                            </SharedStyled.FieldWrapper>

                            <CommercialStyled.ApplyButton onClick={() => { setAppliedFilters(formFilterData); setPage(1); }}> Aplicar filtros </CommercialStyled.ApplyButton>
                        </CommercialStyled.FilterCard>
                    </CommercialStyled.FilterCardContainer>

                    {commercials.length > 0 ? (
                        <CommercialStyled.CardGrid>
                            {commercials.map((commercial) => {
                                const imageUrls = (commercial.imagens ?? []).filter(img => typeof img !== 'string' && 'urlDownload' in img).map(img => (img as any).urlDownload);

                                return (<Card key={commercial.id} id={commercial.id!} images={imageUrls} date={new Date(commercial.data)} ta={actionNames[commercial.tipoAcaoId]} product={commercial.produtoNome} location={commercial.local} chain={commercial.redeNome} />);
                            })}
                        </CommercialStyled.CardGrid>
                    ) : (
                        <SharedStyled.NotFoundContentContainer>
                            <SharedStyled.NotFoundContentIllustration src={EmptyStateVector} />

                            <SharedStyled.WithoutFoundContentText> Nenhum dado encontrado por aqui. </SharedStyled.WithoutFoundContentText>
                        </SharedStyled.NotFoundContentContainer>
                    )}
                </CommercialStyled.ContentWrapper>

                {commercials.length > 0 && (
                    <CommercialStyled.StandalonePagination>
                        <SharedStyled.TableWrapper>
                            <SharedStyled.TableListWrapper>
                                <tbody>
                                    <SharedStyled.TableListBodyRow>
                                        <SharedStyled.TableListBodyRowData colSpan={3}>
                                            <Pagination
                                                currentPage={page}
                                                pageSize={pageSize}
                                                totalPages={totalPages}
                                                onPageChange={(newPage) => setPage(newPage)}
                                                onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(1); }}
                                                customPageOptions={[{ value: 6, label: 6 }, { value: 12, label: 12 }, { value: 30, label: 30 }, { value: 48, label: 48 }]}
                                            />
                                        </SharedStyled.TableListBodyRowData>
                                    </SharedStyled.TableListBodyRow>
                                </tbody>
                            </SharedStyled.TableListWrapper>
                        </SharedStyled.TableWrapper>
                    </CommercialStyled.StandalonePagination>
                )}

                <GenericDrawer isOpen={drawerOpen} onClose={() => { setDrawerOpen(false); }} title={'Cadastrar ação'}>
                    <CommercialForm initialValues={undefined} onCancel={() => { setDrawerOpen(false); }} onSubmit={async () => { setDrawerOpen(false); handleRead(); }} />
                </GenericDrawer>
            </SharedStyled.ListWrapper>
        </>
    );
};

export default Commercial;