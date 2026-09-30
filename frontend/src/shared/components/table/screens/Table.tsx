import React from 'react';
import { Info, SquarePen, Trash } from 'lucide-react';

import * as Styled from '../styles/table.style';
import { TableProps } from '../interfaces/tableProps.interface';

export const Table = <T,>({ headers, data, isInBatchScreen, getEntityId, onView, onEdit, onDelete, renderEntityRow, canView = false, canEdit, canDelete, }: TableProps<T>) => {
    return (
            <Styled.TableWrapper>
                <Styled.TableListWrapper>
                        <thead>
                            <Styled.TableListHeaderRow>
                                { headers.map((header, index) => (
                                    <Styled.TableListHeaderRowColumn key={ index }> { header } </Styled.TableListHeaderRowColumn>
                                )) }
                            </Styled.TableListHeaderRow>
                        </thead>

                        <tbody>
                            { data.map((entity) => {
                                const id = getEntityId(entity);
                                const shouldShowView = Boolean(onView && canView !== undefined && (typeof canView === "boolean" ? canView : canView(entity)));
                                const shouldShowEdit = Boolean(onEdit && canEdit !== undefined && (typeof canEdit === "boolean" ? canEdit : canEdit(entity)));
                                const shouldShowDelete = Boolean(onDelete && canDelete !== undefined && (typeof canDelete === "boolean" ? canDelete : canDelete(entity)));

                                return (
                                    <Styled.TableListBodyRow key={ id }>
                                        { renderEntityRow(entity) }

                                        <Styled.TableListBodyRowData $isInBatchScreen={ isInBatchScreen }>
                                            { (shouldShowView || shouldShowEdit || shouldShowDelete) && (
                                                <Styled.TableListBodyRowDataActions>
                                                    { shouldShowView && (
                                                        <Styled.TableListBodyRowDataActionButton type="button" onClick={ () => onView?.(id) }> <Info size={ 25 } /> </Styled.TableListBodyRowDataActionButton>
                                                    ) }
                                                    { shouldShowEdit && (
                                                        <Styled.TableListBodyRowDataActionButton type="button" onClick={ () => onEdit?.(id) }> <SquarePen size={ 25 } /> </Styled.TableListBodyRowDataActionButton>
                                                    ) }
                                                    { shouldShowDelete && (
                                                        <Styled.TableListBodyRowDataActionButton type="button" onClick={ () => onDelete?.(id) }> <Trash size={ 25 } /> </Styled.TableListBodyRowDataActionButton>
                                                    ) }
                                                </Styled.TableListBodyRowDataActions>
                                            ) }
                                        </Styled.TableListBodyRowData>
                                    </Styled.TableListBodyRow>
                                );
                            }) }
                        </tbody>
                </Styled.TableListWrapper>
            </Styled.TableWrapper>
    );
}
