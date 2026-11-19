import React from 'react';

import * as S from '../styles/table.style';
import * as I from '../../../../shared/styles/icon.style';

import { TableProps } from '../interfaces/tableProps.interface';

export const Table = <T,>({ headers, data, isInBatchScreen, getEntityId, onView, onEdit, onDelete, renderEntityRow, canView = false, canEdit, canDelete, }: TableProps<T>) => {
    return (
        <S.TableWrapper>
            <S.TableListWrapper>
                <thead>
                    <S.TableListHeaderRow>
                        { headers.map((header, index) => (
                            <S.TableListHeaderRowColumn key={ index }> { header } </S.TableListHeaderRowColumn>
                        )) }
                    </S.TableListHeaderRow>
                </thead>

                <tbody>
                    { data.map((entity) => {
                        const id = getEntityId(entity);
                        const shouldShowView = Boolean(onView && canView !== undefined && (typeof canView === "boolean" ? canView : canView(entity)));
                        const shouldShowEdit = Boolean(onEdit && canEdit !== undefined && (typeof canEdit === "boolean" ? canEdit : canEdit(entity)));
                        const shouldShowDelete = Boolean(onDelete && canDelete !== undefined && (typeof canDelete === "boolean" ? canDelete : canDelete(entity)));

                        return (
                            <S.TableListBodyRow key={ id }>
                                { renderEntityRow(entity) }

                                <S.TableListBodyRowData $isInBatchScreen={ isInBatchScreen }>
                                    { (shouldShowView || shouldShowEdit || shouldShowDelete) && (
                                        <S.TableListBodyRowDataActions>
                                            { shouldShowView && (
                                                <S.TableListBodyRowDataActionButton type="button" onClick={ () => onView?.(id) }> <I.MessageSquareMoreIcon/> </S.TableListBodyRowDataActionButton>
                                            ) }
                                            { shouldShowEdit && (
                                                <S.TableListBodyRowDataActionButton type="button" onClick={ () => onEdit?.(id) }> <I.SquarePenIcon/> </S.TableListBodyRowDataActionButton>
                                            ) }
                                            { shouldShowDelete && (
                                                <S.TableListBodyRowDataActionButton type="button" onClick={ () => onDelete?.(id) }> <I.TrashIcon/> </S.TableListBodyRowDataActionButton>
                                            ) }
                                        </S.TableListBodyRowDataActions>
                                    ) }
                                </S.TableListBodyRowData>
                            </S.TableListBodyRow>
                        );
                    }) }
                </tbody>
            </S.TableListWrapper>
        </S.TableWrapper>
    );
}
