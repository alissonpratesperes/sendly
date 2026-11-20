import { toast } from 'react-toastify';
import React, { Fragment, useEffect, useState } from 'react';

import * as I from '../../../shared/styles/icon.style';
import * as S from '../../../shared/components/drawer/styles/drawer.style';
import * as F from '../../../shared/components/dropdown/styles/contactFormDropdown.style';

import { List } from '../../list/services/list.service';
import { ImportContactsCsv } from '../services/contact.service';
import { ListResponseDto } from '../../list/dtos/listResponse.dto';
import { ImportContactResponseDto } from '../dtos/importContactResponse.dto';
import { importErrorMessages } from '../mappings/importErrorMessages.mapping';
import { Dropdown } from '../../../shared/components/dropdown/screens/Dropdown';
import { Uploader } from '../../../shared/components/uploader/screens/Uploader';
import { ImportFormProps } from '../../../shared/interfaces/importFormProps.interface';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';

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
                <S.Form id="contact-import-form" onSubmit={ handleSubmit }>
                    <S.FieldWrapper>
                        <Dropdown
                            inputId="listId"
                            isLoading={ isListsLoading }
                            options={ optionsForLists }
                            placeholder="Vincule a uma lista"
                            value={ optionsForLists.find((option) => option.value === listId) ?? null }
                            onChange={ (selectedOption) => setListId(selectedOption?.value ?? 0) }

                            formatOptionLabel={ (option) => (
                                <F.OptionContent>
                                    <F.ListColor $color={ option.color }/>

                                    <span> { option.label } </span>
                                </F.OptionContent>
                            ) }
                        />
                    </S.FieldWrapper>

                    <Uploader isCsv={ true } value={ csvFile } onChange={ (file) => setCsvFile(file as File | undefined) } blockRemove={ false }/>
                </S.Form>
            ) : (
                <S.ContactImportResultContainer>
                    <S.ImportResultTitle> <I.DatabaseCheckIcon/> Resultado da importação </S.ImportResultTitle>

                    <S.ImportResultInformations>
                        <S.ImportResultSucceededTitle> <I.CircleCheckIcon/> { importResult.valid } </S.ImportResultSucceededTitle>
                        <S.ImportResultUnsucceededTitle> <I.CircleAlertIcon/> { importResult.invalid } </S.ImportResultUnsucceededTitle>
                    </S.ImportResultInformations>

                    { importResult.errors.length > 0 && (
                        <S.ImportResultErrorList>
                            <S.ImportResultErrorListTitle> <I.ScrollTextIcon/> Log do processamento </S.ImportResultErrorListTitle>

                            { importResult.errors.map((error, index) => (
                                <S.ImportResultErrorListItem key={ index }>
                                    <S.ImportResultLeftContainer> <I.AlertCircleIcon/> </S.ImportResultLeftContainer>

                                    <S.ImportResultRightContainer>
                                        <S.ImportResultErrorName> { error.name } </S.ImportResultErrorName>
                                        <S.ImportResultErrorMessage> { importErrorMessages[error.error] ?? "Erro desconhecido" } </S.ImportResultErrorMessage>
                                    </S.ImportResultRightContainer>
                                </S.ImportResultErrorListItem>
                            )) }
                        </S.ImportResultErrorList>
                    ) }
                </S.ContactImportResultContainer>
            )}
        </Fragment>
    );
}
