import React from 'react';
import { DatabaseArrowUp, DatabasePlus, Search } from 'lucide-react';

import * as Styled from '../styles/finder.style';
import { FinderProps } from '../interfaces/finderProps.interface';

export const Finder: React.FC<FinderProps> = ({ showImportButton = false, importButtonText, showAddButton = false, placeholder, buttonText, search, onAdd, onImport, onSearchChange }) => {
    return (
        <Styled.SearchInputWrapper>
            <Styled.SearchInputContainer>
                <Search size={ 25 } color="#1C70E9" />

                <Styled.SearchInputField type="text" placeholder={ placeholder } value={ search } onChange={ (event) => onSearchChange(event.target.value) } />
            </Styled.SearchInputContainer>

            { showImportButton && (
                <Styled.AddButton type="button" onClick={ onImport }>
                    <DatabaseArrowUp size={ 25 } />

                    <Styled.SearchInputSubmitText> { importButtonText } </Styled.SearchInputSubmitText>
                </Styled.AddButton>
            ) }
            { showAddButton && (
                <Styled.AddButton type="button" onClick={ onAdd }>
                    <DatabasePlus size={ 25 } />

                    <Styled.SearchInputSubmitText> { buttonText } </Styled.SearchInputSubmitText>
                </Styled.AddButton>
            ) }
        </Styled.SearchInputWrapper>
    );
}
