import React from 'react';
import { CirclePlus, Search } from 'lucide-react';

import * as Styled from '../styles/finder.style';
import { FinderProps } from '../interfaces/finderProps.interface';

export const Finder: React.FC<FinderProps> = ({ isSystemRoot, placeholder, buttonText, search, onAdd, onSearchChange }) => {
    return (
        <Styled.SearchInputWrapper>
            <Styled.SearchInputContainer>
                <Search size={ 25 } color="#1C70E9" />

                <Styled.SearchInputField type="text" placeholder={ placeholder } value={ search } onChange={ (event) => onSearchChange(event.target.value) } />
            </Styled.SearchInputContainer>

            { isSystemRoot && (
                <Styled.AddButton type="button" onClick={ onAdd }>
                    <CirclePlus size={ 25 } />

                    <Styled.SearchInputSubmitText> { buttonText } </Styled.SearchInputSubmitText>
                </Styled.AddButton>
            ) }
        </Styled.SearchInputWrapper>
    );
}
