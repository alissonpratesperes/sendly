import React from 'react';

import * as Styled from '../styles/finder.style';
import * as G from '../../../styles/global.style';
import * as I from '../../../shared/styles/icon.style';

import { FinderProps } from '../interfaces/finderProps.interface';

export const Finder: React.FC<FinderProps> = ({ showImportButton = false, importButtonText, showAddButton = false, placeholder, buttonText, search, onAdd, onImport, onSearchChange }) => {
    return (
        <Styled.SearchInputWrapper $isSystemRoot={ showAddButton }>
            <Styled.SearchInputContainer>
                <I.SearchIcon/>

                <Styled.SearchInputField type="text" placeholder={ placeholder } value={ search } onChange={ (event) => onSearchChange(event.target.value) }/>
            </Styled.SearchInputContainer>

            <G.ButtonsContainer>
                { showImportButton && (
                    <Styled.AddButton type="button" onClick={ onImport }>
                        <I.DatabaseArrowUpIcon/>

                        <Styled.SearchInputSubmitText> { importButtonText } </Styled.SearchInputSubmitText>
                    </Styled.AddButton>
                ) }
                { showAddButton && (
                    <Styled.AddButton type="button" onClick={ onAdd }>
                        <I.DatabasePlusIcon/>

                        <Styled.SearchInputSubmitText> { buttonText } </Styled.SearchInputSubmitText>
                    </Styled.AddButton>
                ) }
            </G.ButtonsContainer>
        </Styled.SearchInputWrapper>
    );
}
