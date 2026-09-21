import React from 'react';
import { Pen, Trash } from 'lucide-react';

import * as Styled from '../styles/table.style';
import { TableProps } from '../interfaces/tableProps.interface';

export const Table = <T,>({ headers, data, getEntityId, onEdit, onDelete, renderEntityRow, }: TableProps<T>) => {
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

                                return (
                                    <Styled.TableListBodyRow key={ id }>
                                        { renderEntityRow(entity) }
                                        { (onEdit || onDelete) && (
                                            <Styled.TableListBodyRowData>
                                                <Styled.TableListBodyRowDataActions>
                                                    { onEdit && (
                                                        <Styled.TableListBodyRowDataActionButton type="button" onClick={ () => onEdit(id) }>
                                                            <Pen size={ 25 } color="#238636" />
                                                        </Styled.TableListBodyRowDataActionButton>
                                                    ) }
                                                    { onDelete && (
                                                        <Styled.TableListBodyRowDataActionButton type="button" onClick={ () => onDelete(id) }>
                                                            <Trash size={ 25 } color="#DC143C" />
                                                        </Styled.TableListBodyRowDataActionButton>
                                                    ) }
                                                </Styled.TableListBodyRowDataActions>
                                            </Styled.TableListBodyRowData>
                                        ) }
                                    </Styled.TableListBodyRow>
                                );
                            }) }
                        </tbody>
                </Styled.TableListWrapper>
            </Styled.TableWrapper>
    );
}
