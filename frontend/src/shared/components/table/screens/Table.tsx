import React from 'react';
import { SquarePen, Trash } from 'lucide-react';

import * as Styled from '../styles/table.style';
import { TableProps } from '../interfaces/tableProps.interface';

export const Table = <T,>({ headers, data, getEntityId, onEdit, onDelete, renderEntityRow, canEdit, canDelete, }: TableProps<T>) => {
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
                                const shouldShowEdit = Boolean(onEdit && canEdit !== undefined && (typeof canEdit === "boolean" ? canEdit : canEdit(entity)));
                                const shouldShowDelete = Boolean(onDelete && canDelete !== undefined && (typeof canDelete === "boolean" ? canDelete : canDelete(entity)));

                                return (
                                    <Styled.TableListBodyRow key={ id }>
                                        { renderEntityRow(entity) }

                                        <Styled.TableListBodyRowData>
                                            { (shouldShowEdit || shouldShowDelete) && (
                                                <Styled.TableListBodyRowDataActions>
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
