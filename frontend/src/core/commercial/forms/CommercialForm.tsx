import * as z from 'zod';
import Select from 'react-select';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Create } from '../services/Commercial.service';
import { Update } from '../services/Commercial.service';
import { ChainDTO } from '../../chain/dtos/ChainDTO.dto';
import { StoreDTO } from '../../store/dtos/StoreDTO.dto';
import { ActionDTO } from '../../action/dtos/ActionDTO.dto';
import * as CommercialStyled from '../styles/Commercial.style';
import { CategoryDTO } from '../../category/dtos/CategoryDTO.dto';
import Toast from '../../../shared/components/toast/screens/Toast';
import { Read as ReadChains } from '../../chain/services/Chain.service';
import { Read as ReadStores } from '../../store/services/Store.service';
import * as SharedStyled from '../../../shared/styles/Registration.style';
import { Read as ReadActions } from '../../action/services/Action.service';
import Uploader from '../../../shared/components/uploader/screens/Uploader';
import { Read as ReadCategories } from '../../category/services/Category.service';
import { CommercialFormProps } from '../interfaces/CommercialFormProps.interface';
import * as Styled from '../../../shared/components/drawer/styles/genericDrawer.style';
import { useLoading } from '../../../shared/components/loading/contexts/LoadingContext.context';
import { CommercialFormData, CommercialFormSchema } from '../schemas/CommercialFormSchema.schema';
import { UploaderItemType } from '../../../shared/components/uploader/types/UploaderItemType.type';
import { PaginatedRequestDTO } from '../../../shared/components/pagination/dtos/PaginatedRequestDTO.dto';

export const CommercialForm: React.FC<CommercialFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [stores, setStores] = useState<StoreDTO[]>([]);
  const [chains, setChains] = useState<ChainDTO[]>([]);
  const [actions, setActions] = useState<ActionDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [formData, setFormData] = useState<CommercialFormData>({
    id: undefined,
    tipoAcaoId: 0,
    data: new Date(),
    redeId: undefined,
    lojaId: undefined,
    local: '',
    categoriaProdutoId: 0,
    produtoId: undefined,
    imagens: [] as UploaderItemType[]
  });

  const { showLoading, hideLoading } = useLoading();

  const chainOptions = chains.filter(chain => chain.ativo).map((chain) => ({ value: chain.id, label: chain.nome }));
  const actionOptions = actions.filter(action => action.ativo).map((action) => ({ value: action.id, label: action.nome }));

  const filteredStores = formData.redeId ? stores.filter(store => store.redeId === formData.redeId && store.ativo) : stores.filter(store => store.ativo);
  const optionsForStores = filteredStores.filter(store => store.redeId != null).map(store => ({ value: store.id, label: store.apelido })).sort((a, b) => a.label.localeCompare(b.label));

  const categoryOptions = categories.filter(category => category.ativo).map((category) => ({ value: category.id, label: category.nome })).sort((a, b) => a.label.localeCompare(b.label));
  const CustomDateInput = React.forwardRef<HTMLInputElement, any>(({ value, onClick }, ref) => (<SharedStyled.DateInput readOnly onClick={onClick} ref={ref} value={value} placeholder="DD/MM/AAAA" />));

  function base64ToFile(base64: string, filename: string, mimeType: string): File {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    };

    return new File([intArray], filename, { type: mimeType });
  };

  const handleSubmit = async (formEvent: React.FormEvent) => {
    formEvent.preventDefault();

    try {
      showLoading();

      const validatedFormData = CommercialFormSchema.parse(formData);
      const formDataToSend = new FormData();

      formDataToSend.append('tipoAcaoId', String(validatedFormData.tipoAcaoId));
      formDataToSend.append('data', validatedFormData.data.toISOString());

      if (validatedFormData.redeId) {
        formDataToSend.append('redeId', String(validatedFormData.redeId));
      };
      if (validatedFormData.lojaId) {
        formDataToSend.append('lojaId', String(validatedFormData.lojaId));
      };
      if (validatedFormData.local) {
        formDataToSend.append('local', validatedFormData.local);
      };

      formDataToSend.append('categoriaProdutoId', String(validatedFormData.categoriaProdutoId));

      if (validatedFormData.produtoId) {
        formDataToSend.append('produtoId', String(validatedFormData.produtoId));
      };

      const newFiles = validatedFormData.imagens.filter(img => img instanceof File) as File[];
      const existingImages = validatedFormData.imagens.filter(img => !(img instanceof File) && 'url' in img && 'nome' in img) as { url: string, nome: string }[];

      newFiles.forEach(file => formDataToSend.append('imagens', file));

      for (const img of existingImages) {
        const file = base64ToFile(img.url, img.nome, 'image/jpeg');

        formDataToSend.append('imagens', file);
      };

      initialValues?.id ? await Update(initialValues.id, formDataToSend) : await Create(formDataToSend);

      onSubmit();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        toast.error(<Toast errors={error.issues} />);
      } else {
        initialValues?.id ? toast.error(`Erro ao atualizar Ação Comercial: ${error}`) : toast.error(`Erro ao criar Ação Comercial: ${error}`);
      };
    } finally {
      hideLoading();
    };
  };

  const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = changeEvent.target;

    setFormData((prev) => ({ ...prev, [name]: type === 'date' ? new Date(value) : value }));
  };
  const handleImageChange = (updatedImages: UploaderItemType[]) => {
    setFormData(prev => ({ ...prev, imagens: updatedImages }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: PaginatedRequestDTO = { page: 1, pageSize: 100, sortBy: 'id', sortDir: 'desc', search: '' };
        const [actionsResponse, chainsResponse, categoriesResponse] = await Promise.all([ReadActions(params), ReadChains(params), ReadCategories(params)]);

        setActions(actionsResponse.items);
        setChains(chainsResponse.items);
        setCategories(categoriesResponse.items);

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

        await fetchAllStores();
      } catch (error) {
        toast.error(`Erro ao carregar os dados: ${error}`);
      };
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (initialValues) {
      setFormData({ ...initialValues, data: new Date(initialValues.data) });
    };
  }, [initialValues]);

  return (
    <Styled.Form onSubmit={handleSubmit}>
      <Styled.FieldWrapper>
        {/* <Styled.RequiredLabel htmlFor="tipoAcaoId" required> Tipo da ação </Styled.RequiredLabel> */}

        <Select
          isClearable={true}
          inputId="tipoAcaoId"
          options={actionOptions}
          placeholder="Selecione a ação"
          styles={CommercialStyled.SelectCommonStyles}
          components={{ IndicatorSeparator: () => null }}
          value={actionOptions.find((option) => option.value === formData.tipoAcaoId) || undefined}
          onChange={(option) => setFormData(prev => ({ ...prev, tipoAcaoId: option?.value || 0 }))}
        />
      </Styled.FieldWrapper>

      <Styled.FieldWrapper>
        {/* <Styled.RequiredLabel htmlFor="data" required> Selecione a data da ação </Styled.RequiredLabel> */}

        <SharedStyled.CustomDatePickerWrapper>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={formData.data}
            customInput={<CustomDateInput />}
            dayClassName={() => "custom-day"}
            calendarClassName="custom-calendar"
            wrapperClassName="custom-datepicker-wrapper"
            onChange={(date: Date | null) => { if (date) { setFormData(prev => ({ ...prev, data: date })); }; }}
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
              <div className="custom-header">
                <button className="nav-button prev" onClick={decreaseMonth}> <ChevronLeft size={18} /> </button>

                <span className="header-month"> {date.toLocaleString('pt-BR', { month: 'long' })} </span>

                <button className="nav-button next" onClick={increaseMonth}> <ChevronRight size={18} /> </button>
              </div>
            )}
          />
        </SharedStyled.CustomDatePickerWrapper>
      </Styled.FieldWrapper>

      <Styled.FieldWrapper>
        <Styled.Label htmlFor="redeId"> Rede </Styled.Label>

        <Select
          inputId="redeId"
          isClearable={true}
          options={chainOptions}
          placeholder="Selecione a rede"
          styles={CommercialStyled.SelectCommonStyles}
          components={{ IndicatorSeparator: () => null }}
          value={chainOptions.find((option) => option.value === formData.redeId) || undefined}
          onChange={(option) => setFormData(prev => ({ ...prev, redeId: option?.value || undefined, lojaId: undefined }))}
        />
      </Styled.FieldWrapper>
      <Styled.FieldWrapper>
        <Styled.Label htmlFor="lojaId"> Loja </Styled.Label>

        <Select
          inputId="lojaId"
          isClearable={true}
          options={optionsForStores}
          placeholder="Selecione a loja"
          styles={CommercialStyled.SelectCommonStyles}
          components={{ IndicatorSeparator: () => null }}
          onChange={(option) => setFormData(prev => ({ ...prev, lojaId: option?.value || 0 }))}
          value={optionsForStores.find((option) => option.value === formData.lojaId) || undefined}
        />
      </Styled.FieldWrapper>

      <Styled.FieldWrapper>
        <Styled.Label htmlFor="local"> Local público </Styled.Label>

        <Styled.Input id="local" name="local" placeholder="Digite o nome do local" value={formData.local ?? ""} onChange={handleChange} />
      </Styled.FieldWrapper>

      <Styled.FieldWrapper>
        {/* <Styled.RequiredLabel htmlFor="categoriaProdutoId" required> Categoria de produto </Styled.RequiredLabel> */}

        <Select
          isClearable={true}
          options={categoryOptions}
          inputId="categoriaProdutoId"
          placeholder="Selecione a categoria"
          styles={CommercialStyled.SelectCommonStyles}
          components={{ IndicatorSeparator: () => null }}
          value={categoryOptions.find((option) => option.value === formData.categoriaProdutoId) || undefined}
          onChange={(option) => { setFormData(prev => ({ ...prev, categoriaProdutoId: option?.value || 0, produtoId: undefined })); }}
        />
      </Styled.FieldWrapper>

      <Styled.FieldWrapper>
        <Styled.Label> Fotos </Styled.Label>

        <Uploader value={formData.imagens} onChange={handleImageChange} />
      </Styled.FieldWrapper>

      <Styled.Footer>
        <Styled.FooterButton type="button" $variant="secondary" onClick={onCancel}> Cancelar </Styled.FooterButton>
        <Styled.FooterButton type="submit" $variant="primary"> {initialValues?.id ? 'Atualizar ação' : 'Cadastrar ação'} </Styled.FooterButton>
      </Styled.Footer>
    </Styled.Form>
  );
};