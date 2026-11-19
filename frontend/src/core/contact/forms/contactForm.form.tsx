import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { AsYouType, CountryCode, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';

import * as G from '../../../shared/styles/global.style';
import * as S from '../../../shared/components/drawer/styles/drawer.style';
import * as F from '../../../shared/components/dropdown/styles/contactFormDropdown.style';

import { List } from '../../list/services/list.service';
import { Create, Update } from '../services/contact.service';
import { ListResponseDto } from '../../list/dtos/listResponse.dto';
import { Toast } from '../../../shared/components/toast/screens/Toast';
import { CreateContactCommandDto } from '../dtos/createContactCommand.dto';
import { UpdateContactCommandDto } from '../dtos/updateContactCommand.dto';
import { FormProps } from '../../../shared/interfaces/formProps.interface';
import { AVAILABLE_COUNTRIES } from '../constants/availableCountries.constant';
import { Dropdown } from '../../../shared/components/dropdown/screens/Dropdown';
import { ContactFormData, ContactFormSchema } from '../schemas/contactFormSchema.schema';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';

export const ContactForm: React.FC<FormProps<ContactFormData>> = ({ initialValues, onSubmit, onLoadingChange, }) => {
    const { userInformation } = getAuthenticationStorage();

    const [limit, setLimit] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [lists, setLists] = useState<ListResponseDto[]>([]);
    const [isListsLoading, setIsListsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<ContactFormData>({ companyId: 0, listId: 0, name: "", phone: "", country: "", });

    const optionsForLists = lists
        .filter((list: ListResponseDto) => list.id !== undefined && list.id !== null)
        .map((list: ListResponseDto) => ({ value: Number(list.id), label: list.name, color: list.color, }))
        .sort((a, b) => a.label.localeCompare(b.label));
    const regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region", } );
    const optionsForCountries = AVAILABLE_COUNTRIES
        .map((country) => ({
            value: country,
            label: `${ regionNames.of(country) } +${ getCountryCallingCode(country) }`,
            countryName: regionNames.of(country) ?? "",
            flag: country.replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0))),
        }))
        .sort((a, b) => a.countryName.localeCompare(b.countryName, "pt-BR"))
        .map(({ countryName, ...option }) => option);

    const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = changeEvent.target;

        setFormData((previous: ContactFormData) => {
            if (name === "phone" && previous.country) {
                const country = previous.country as CountryCode;
                const formattedPhone = new AsYouType(country).input(value);

                return {
                    ...previous,

                    phone: formattedPhone,
                };
            }

            return {
                ...previous,
                [name]: value,
            };
        });
    };
    const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

        onLoadingChange(true);

        try {
            const validatedFormData = ContactFormSchema.parse(formData);

            if (!validatedFormData.country) {
                throw new Error("O país é obrigatório");
            }

            const parsedPhone = parsePhoneNumberFromString(validatedFormData.phone, validatedFormData.country);

            if (!parsedPhone || !parsedPhone.isValid()) {
                throw new Error("O telefone informado é inválido");
            }

            const normalizedPhone = parsedPhone.number;

            if (initialValues?.id === undefined) {
                const command: CreateContactCommandDto = {
                    companyId: userInformation?.company.id ?? 0,
                    listId: validatedFormData.listId,
                    name: validatedFormData.name,
                    phone: normalizedPhone,
                    country: validatedFormData.country,
                }

                await Create(command);

                toast.success("Contato criado com sucesso");
            } else {
                const command: UpdateContactCommandDto = {
                    listId: validatedFormData.listId,
                    name: validatedFormData.name,
                    phone: normalizedPhone,
                    country: validatedFormData.country,
                }

                await Update({ id: initialValues.id }, command);

                toast.success("Contato editado com sucesso");
            }

            onSubmit();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error(<Toast errors={ error.issues }/>);
            } else {
                toast.error("Não é possível prosseguir com a solicitação");
            }
        } finally {
            onLoadingChange(false);
        }
    }

    useEffect(() => {
        const progressiveListsFetch = async () => {
            try {
                setIsListsLoading(true);

                const fetchAllLists = async () => {
                    let page = 1;
                    let totalPages = 0;
                    let allFetchedLists: ListResponseDto[] = [];

                    do {
                        const companyId = initialValues?.companyId ?? userInformation?.company.id;
                        const response = await List({ page, limit, search, companyId, });

                        allFetchedLists = [ ...allFetchedLists, ...response.data ];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setLists(allFetchedLists);
                };

                await fetchAllLists();
            } catch (error) {
                toast.error(`Erro ao listar as opções de Listas: ${ error }`);
            } finally {
                setIsListsLoading(false);
            }
        };

        progressiveListsFetch();
    }, []);
    useEffect(() => {
        if (initialValues) {
            const parsedContactPhone = parsePhoneNumberFromString(initialValues.phone);

            setFormData({ ...initialValues, phone: parsedContactPhone?.formatNational() ?? "", country: parsedContactPhone?.country ?? "", });
        } else {
            setFormData({ ...formData, country: "BR", });
        }
    }, [ initialValues, ]);

    return (
        <S.Form id="contact-form" onSubmit={ handleSubmit }>
            <S.FieldWrapper>
                <Dropdown
                    inputId="listId"
                    isLoading={ isListsLoading }
                    options={ optionsForLists }
                    placeholder="Vincule a uma lista"
                    value={ optionsForLists.find((option) => option.value === formData.listId) ?? null }
                    onChange={ (selectedOption) => setFormData((previous) => ({ ...previous, listId: selectedOption?.value ?? 0 })) }

                    formatOptionLabel={ (option) => (
                        <F.OptionContent>
                            <F.ListColor $color={ option.color }/>

                            <span> { option.label } </span>
                        </F.OptionContent>
                    ) }
                />
            </S.FieldWrapper>
            <S.FieldWrapper>
                <G.Label htmlFor="name"> Nome </G.Label>

                <S.Input id="name" name="name" placeholder="Digite o nome do contato" value={ formData.name } onChange={ handleChange }/>
            </S.FieldWrapper>
            <S.FieldWrapper>
                <G.Label htmlFor="phone"> Telefone </G.Label>

                <S.Input id="phone" name="phone" placeholder="Digite o telefone do contato" value={ formData.phone } onChange={ handleChange }/>
            </S.FieldWrapper>
            <S.FieldWrapper>
                <Dropdown
                    inputId="country"
                    options={ optionsForCountries }
                    placeholder="Selecione um país"
                    value={ optionsForCountries.find((option) => option.value === formData.country) ?? null }
                    onChange={ (selectedOption) => setFormData((previous) => ({ ...previous, country: selectedOption?.value ?? "" })) }

                    formatOptionLabel={ (option) => (
                        <F.OptionContent>
                            <F.CountryFlag> { option.flag } </F.CountryFlag>

                            <span> { option.label } </span>
                        </F.OptionContent>
                    ) }
                />
            </S.FieldWrapper>
        </S.Form>
    );
}
