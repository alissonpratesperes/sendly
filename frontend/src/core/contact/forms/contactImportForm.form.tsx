import { toast } from 'react-toastify';
import { AlertCircle, CircleAlert, CircleCheck, DatabaseCheck, Dot, ScrollText } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';

import { List } from '../../list/services/list.service';
import { ImportContactsCsv } from '../services/contact.service';
import { ListResponseDto } from '../../list/dtos/listResponse.dto';
import Dropdown from '../../../shared/components/dropdown/screens/Dropdown';
import Uploader from '../../../shared/components/uploader/screens/Uploader';
import { ImportContactResponseDto } from '../dtos/importContactResponse.dto';
import { importErrorMessages } from '../mappings/importErrorMessages.mapping';
import * as Styled from '../../../shared/components/drawer/styles/drawer.style';
import { ImportFormProps } from '../../../shared/interfaces/importFormProps.interface';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import * as ContactFormStyled from '../../../shared/components/dropdown/styles/contactFormDropdown.style';

export const ContactImportForm: React.FC<ImportFormProps> = ({ onCancel, onSubmit, onLoadingChange, onResultChange, }) => {
    const { userInformation } = getAuthenticationStorage();

    const [limit, setLimit] = useState<number>(15);
    const [csvFile, setCsvFile] = useState<File>();
    const [listId, setListId] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [lists, setLists] = useState<ListResponseDto[]>([]);
    const [isListsLoading, setIsListsLoading] = useState<boolean>(false);
    const [importResult, setImportResult] = useState<ImportContactResponseDto | null>(null);

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
            toast.warning("Selecione uma lista");

            return;
        }

        onLoadingChange(true);

        try {
            const formData = new FormData();

            formData.append("file", csvFile);
            formData.append("listId", String(listId));

            const response = await ImportContactsCsv(formData);

            setImportResult(response);
            onResultChange?.(response.errors.length > 0);

            if (response.errors.length === 0) {
                onSubmit();

                toast.success("Importação realizada com sucesso");
            } else {
                toast.warning("A importação foi concluída com erros, verifique o log");
            }
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
                    const response = await List({ page, limit, search, companyId: userInformation?.company.id ?? 0, });

                    allFetchedLists = [ ...allFetchedLists, ...response.data ];

                    totalPages = response.totalPages;
                    page++;
                } while (page <= totalPages);

                setLists(allFetchedLists);
            } catch (error) {
                toast.error(`Erro ao listar as opções de Listas: ${ error }`);
            } finally {
                setIsListsLoading(false);
            }
        };

        progressiveListsFetch();
    }, []);

    return (
        <Fragment>
            { !importResult ? (
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
                                    <ContactFormStyled.ListColor $color={ option.color }/>

                                    <span> { option.label } </span>
                                </ContactFormStyled.OptionContent>
                            ) }
                        />
                    </Styled.FieldWrapper>

                    <Uploader isCsv={ true } value={ csvFile } onChange={ (file) => setCsvFile(file as File | undefined) } blockRemove={ false }/>
                </Styled.Form>
            ) : (
                <Styled.ContactImportResultContainer>
                    <Styled.ImportResultTitle> <DatabaseCheck size={ 25 }/> Resultado da importação </Styled.ImportResultTitle>

                    <Styled.ImportResultInformations>
                        <Styled.ImportResultSucceededTitle> <CircleCheck size={ 25 } /> { importResult.valid } </Styled.ImportResultSucceededTitle>
                        <Styled.ImportResultUnsucceededTitle> <CircleAlert size={ 25 } /> { importResult.invalid } </Styled.ImportResultUnsucceededTitle>
                    </Styled.ImportResultInformations>

                    { importResult.errors.length > 0 && (
                        <Styled.ImportResultErrorList>
                            <Styled.ImportResultErrorListTitle> <ScrollText size={ 25 } /> Log do processamento </Styled.ImportResultErrorListTitle>

                            { importResult.errors.map((error, index) => (
                                <Styled.ImportResultErrorListItem key={ index }>
                                    <Styled.ImportResultLeftContainer> <AlertCircle size={ 25 } color="#DC143C"/> </Styled.ImportResultLeftContainer>

                                    <Styled.ImportResultRightContainer>
                                        <Styled.ImportResultErrorName> { error.name } </Styled.ImportResultErrorName>
                                        <Styled.ImportResultErrorMessage> { importErrorMessages[error.error] ?? "Erro desconhecido" } </Styled.ImportResultErrorMessage>
                                    </Styled.ImportResultRightContainer>
                                </Styled.ImportResultErrorListItem>
                            )) }
                        </Styled.ImportResultErrorList>
                    ) }
                </Styled.ContactImportResultContainer>
            )}
        </Fragment>
    );
}
