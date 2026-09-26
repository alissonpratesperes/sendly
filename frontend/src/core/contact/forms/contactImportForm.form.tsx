import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';

import { List } from '../../list/services/list.service';
import { ImportContactsCsv } from '../services/contact.service';
import { ListResponseDto } from '../../list/dtos/listResponse.dto';
import Dropdown from '../../../shared/components/dropdown/screens/Dropdown';
import Uploader from '../../../shared/components/uploader/screens/Uploader';
import * as Styled from '../../../shared/components/drawer/styles/drawer.style';
import { ImportFormProps } from '../../../shared/interfaces/importFormProps.interface';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import * as ContactFormStyled from '../../../shared/components/dropdown/styles/contactFormDropdown.style';

export const ContactImportForm: React.FC<ImportFormProps> = ({ onCancel, onSubmit, onLoadingChange, }) => {
    const { userInformation } = getAuthenticationStorage();

    const [csvFile, setCsvFile] = useState<File>();
    const [listId, setListId] = useState<number>(0);
    const [lists, setLists] = useState<ListResponseDto[]>([]);
    const [isListsLoading, setIsListsLoading] = useState<boolean>(false);

    const optionsForLists = lists
        .filter(
            (list: ListResponseDto) =>
                list.id !== undefined && list.id !== null
        )
        .map((list: ListResponseDto) => ({
            value: Number(list.id),
            label: list.name,
            color: list.color,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!csvFile) {
            toast.warning("Selecione um arquivo CSV");

            return;
        }
        if (!listId) {
            toast.warning('Selecione uma lista');

            return;
        }

        onLoadingChange(true);

        try {
            const formData = new FormData();

            formData.append("file", csvFile);
            formData.append("listId", String(listId));

            await ImportContactsCsv(formData);

            toast.success("Importação realizada com sucesso");

            onSubmit();
        } catch (error) {
            toast.error("Não é possível prosseguir com a solicitação");
        } finally {
            onLoadingChange(false);
        }
    }

    useEffect(() => {
        const progressiveListsFetch = async () => {
            try {
                setIsListsLoading(true);

                let page = 1;
                let totalPages = 0;
                let allFetchedLists: ListResponseDto[] = [];

                do {
                    const response = await List({ page, limit: 30, search: "", companyId: userInformation?.company.id ?? 0, });

                    allFetchedLists = [ ...allFetchedLists, ...response.data ];

                    totalPages = response.totalPages;
                    page++;
                } while (page <= totalPages);

                setLists(allFetchedLists);
            } catch (error) {
                toast.error(`Erro ao listar as opções de Listas: ${error}`);
            } finally {
                setIsListsLoading(false);
            }
        };

        progressiveListsFetch();
    }, []);

    return (
        <Styled.Form id="contact-import-form" onSubmit={ handleSubmit }>
            <Styled.FieldWrapper>
                <Dropdown
                    inputId="listId"
                    isLoading={ isListsLoading }
                    options={ optionsForLists }
                    placeholder="Vincule a uma lista"
                    value={ optionsForLists.find((option) => option.value === listId) ?? null }
                    onChange={ (selectedOption) => setListId(selectedOption?.value ?? 0) }

                    formatOptionLabel={ (option) => (
                        <ContactFormStyled.OptionContent>
                            <ContactFormStyled.ListColor $color={ option.color } />

                            <span> { option.label } </span>
                        </ContactFormStyled.OptionContent>
                    ) }
                />
            </Styled.FieldWrapper>

            <Uploader isCsv value={ csvFile } onChange={ (file) => setCsvFile(file as File | undefined) } />
        </Styled.Form>
    );
}
