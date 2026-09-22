import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { AsYouType, CountryCode, getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';

import { List } from '../../list/services/list.service';
import { Create, Update } from '../services/contact.service';
import { ListResponseDto } from '../../list/dtos/listResponse.dto';
import Toast from '../../../shared/components/toast/screens/Toast';
import { CreateContactCommandDto } from '../dtos/createContactCommand.dto';
import { UpdateContactCommandDto } from '../dtos/updateContactCommand.dto';
import { FormProps } from '../../../shared/interfaces/formProps.interface';
import Dropdown from '../../../shared/components/dropdown/screens/Dropdown';
import * as Styled from '../../../shared/components/drawer/styles/drawer.style';
import { ContactFormData, ContactFormSchema } from '../schemas/contactFormSchema.schema';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import * as ContactFormStyled from '../../../shared/components/dropdown/styles/contactFormDropdown.style';

export const ContactForm: React.FC<FormProps<ContactFormData>> = ({ initialValues, onSubmit, onLoadingChange, }) => {
    const { userInformation } = getAuthenticationStorage();

    const [lists, setLists] = useState<ListResponseDto[]>([]);
    const [isListsLoading, setIsListsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<ContactFormData>({ companyId: 0, listId: 0, name: "", phone: "", country: "", });

    const optionsForLists = lists
        .filter((list: ListResponseDto) => list.id !== undefined && list.id !== null)
        .map((list: ListResponseDto) => ({
            value: Number(list.id),
            label: list.name,
            color: list.color,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    const regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region", } );
    const optionsForCountries = getCountries()
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
                toast.error(<Toast errors={error.issues} />);
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
                        const response = await List({ page, limit: 30, search: "" });

                        allFetchedLists = [ ...allFetchedLists, ...response.data ];
                        totalPages = response.totalPages;
                        page++;
                    } while (page <= totalPages);

                    setLists(allFetchedLists);
                };

                await fetchAllLists();
            } catch (error) {
                toast.error(`Erro ao listar as opções de Listas: ${error}`);
            } finally {
                setIsListsLoading(false);
            }
        };

        progressiveListsFetch();
    }, []);
    useEffect(() => {
        if (initialValues) {
            const parsedContactPhone = parsePhoneNumberFromString(initialValues.phone);

            setFormData({
                companyId: initialValues.companyId,
                listId: initialValues.listId,
                name: initialValues.name,
                phone: parsedContactPhone?.formatNational() ?? "",
                country: parsedContactPhone?.country ?? "",
            });
        } else {
            setFormData({ companyId: 0, listId: 0, name: "", phone: "", country: "BR", });
        }
    }, [ initialValues ]);

    return (
        <Styled.Form id="contact-form" onSubmit={ handleSubmit }>
            <Styled.FieldWrapper>
                <Dropdown
                    inputId="listId"
                    isLoading={ isListsLoading }
                    options={ optionsForLists }
                    placeholder="Vincule a uma lista"
                    value={ optionsForLists.find((option) => option.value === formData.listId) ?? null }
                    onChange={ (selectedOption) => setFormData((previous) => ({ ...previous, listId: selectedOption?.value ?? 0 })) }

                    formatOptionLabel={ (option) => (
                        <ContactFormStyled.OptionContent>
                            <ContactFormStyled.ListColor $color={ option.color } />
                            <span> { option.label } </span>
                        </ContactFormStyled.OptionContent>
                    ) }
                />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="name"> Nome </Styled.Label>

                <Styled.Input id="name" name="name" placeholder="Digite o nome do contato" value={ formData.name } onChange={ handleChange } />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="phone"> Telefone </Styled.Label>

                <Styled.Input id="phone" name="phone" placeholder="Digite o telefone do contato" value={ formData.phone } onChange={ handleChange } />
            </Styled.FieldWrapper>
            <Styled.FieldWrapper>
                <Dropdown
                    inputId="country"
                    options={ optionsForCountries }
                    placeholder="Selecione um país"
                    value={ optionsForCountries.find((option) => option.value === formData.country) ?? null }
                    onChange={ (selectedOption) => setFormData((previous) => ({ ...previous, country: selectedOption?.value ?? "" })) }

                    formatOptionLabel={(option) => (
                        <ContactFormStyled.OptionContent>
                            <ContactFormStyled.CountryFlag> { option.flag } </ContactFormStyled.CountryFlag>
                            <span> { option.label } </span>
                        </ContactFormStyled.OptionContent>
                    )}
                />
            </Styled.FieldWrapper>
        </Styled.Form>
    );
}
