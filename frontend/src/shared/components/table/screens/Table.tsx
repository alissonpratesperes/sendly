import React from 'react';
import { Pen, Trash } from 'lucide-react';

import * as Styled from '../styles/listing.style';
import { ListingProps } from '../interfaces/listingProps.interface';

export const Listing = <T,>({
    headers,
    data,
    renderRow,
    getId,
    onEdit,
    onDelete,
}: ListingProps<T>) => {
    return (
        <Styled.ListingWrapper>
            <Styled.ListingHeader>
                {headers.map((header, index) => (
                    <Styled.ListingHeaderColumn key={index}>
                        {header}
                    </Styled.ListingHeaderColumn>
                ))}
            </Styled.ListingHeader>

            <Styled.ListingBody>
                {data.map((item) => {
                    const id = getId(item);

                    return (
                        <Styled.ListingRow key={id}>
                            {renderRow(item)}

                            <Styled.ListingColumn>
                                <Styled.ListingActions>
                                    {onEdit && (
                                        <Styled.ListingActionButton
                                            type="button"
                                            onClick={() => onEdit(id)}
                                        >
                                            <Pen size={25} color="#238636" />
                                        </Styled.ListingActionButton>
                                    )}

                                    {onDelete && (
                                        <Styled.ListingActionButton
                                            type="button"
                                            onClick={() => onDelete(id)}
                                        >
                                            <Trash size={25} color="#DC143C" />
                                        </Styled.ListingActionButton>
                                    )}
                                </Styled.ListingActions>
                            </Styled.ListingColumn>
                        </Styled.ListingRow>
                    );
                })}
            </Styled.ListingBody>
        </Styled.ListingWrapper>
    );
};
