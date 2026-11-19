import React from 'react';

import * as S from '../styles/finder.style';
import * as G from '../../../styles/global.style';
import * as I from '../../../shared/styles/icon.style';

import { FinderProps } from '../interfaces/finderProps.interface';

export const Finder: React.FC<FinderProps> = ({ showImportButton = false, importButtonText, showAddButton = false, placeholder, buttonText, search, onAdd, onImport, onSearchChange }) => {
    return (
        <S.SearchInputWrapper $isSystemRoot={ showAddButton }>
            <S.SearchInputContainer>
                <I.SearchIcon/>

                <S.SearchInputField type="text" placeholder={ placeholder } value={ search } onChange={ (event) => onSearchChange(event.target.value) }/>
            </S.SearchInputContainer>

            <G.ButtonsContainer>
                { showImportButton && (
                    <S.AddButton type="button" onClick={ onImport }>
                        <I.DatabaseArrowUpIcon/>

                        <S.SearchInputSubmitText> { importButtonText } </S.SearchInputSubmitText>
                    </S.AddButton>
                ) }
                { showAddButton && (
                    <S.AddButton type="button" onClick={ onAdd }>
                        <I.DatabasePlusIcon/>

                        <S.SearchInputSubmitText> { buttonText } </S.SearchInputSubmitText>
                    </S.AddButton>
                ) }
            </G.ButtonsContainer>
        </S.SearchInputWrapper>
    );
}
