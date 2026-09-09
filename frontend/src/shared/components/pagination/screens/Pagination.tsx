import Select from 'react-select';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import * as Styled from '../styles/Pagination.style';
import { PaginationProps } from '../interfaces/PaginationProps.interface';
import * as RegistrationSharedStyled from '../../../../shared/styles/Registration.style';

const Pagination: React.FC<PaginationProps> = ({ pageSize, totalPages, currentPage, onPageChange, onPageSizeChange, customPageOptions }) => {
    const pageOptions = customPageOptions ?? [{ value: 5, label: 5 }, { value: 10, label: 10 }, { value: 30, label: 30 }, { value: 50, label: 50 }];
    const [lastPageInput, setLastPageInput] = useState<string>(String(currentPage));

    const generatePages = (): (number | string)[] => {
        const pages: (number | string)[] = [];

        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            };

            return pages;
        };

        pages.push(1, 2, 3);

        let startBlock = currentPage;

        if (startBlock < 4) {
            startBlock = 4;
        };

        const maxStart = totalPages - 3 + 1;

        if (startBlock > maxStart) {
            startBlock = maxStart;
        };

        pages.push('...');

        for (let i = startBlock; i < startBlock + 3 && i <= totalPages; i++) {
            pages.push(i);
        };

        return pages;
    };
    const handlePageClick = (page: number | string) => {
        if (typeof page === 'number' && page !== currentPage) {
            onPageChange(page);
        };
    };
    const handleLastPageInputChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const val = changeEvent.target.value;

        if (/^\d*$/.test(val)) {
            setLastPageInput(val);
        };
    };
    const handleLastPageInputConfirm = () => {
        const val = Number(lastPageInput);

        if (val >= 1 && val <= totalPages) {
            onPageChange(val);
        } else {
            setLastPageInput(String(currentPage));
        };
    };

    useEffect(() => {
        setLastPageInput(String(currentPage));
    }, [currentPage]);

    return (
        <Styled.PaginationContainer>
            <Styled.PaginationButton onClick={() => onPageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} >
                <ArrowLeft size={20} />

                <Styled.PaginationButtonTextLeft >Anterior </Styled.PaginationButtonTextLeft>
            </Styled.PaginationButton>

            <Styled.PagesArray>
                {generatePages().map((page, index) => page === '...' ? (<Styled.EllipsisButton key={index}>...</Styled.EllipsisButton>) : (<Styled.PageButton key={index} onClick={() => handlePageClick(page)} $active={page === currentPage}> {page} </Styled.PageButton>))}

                <Styled.LastPageInput type="text" min={1} max={totalPages} value={lastPageInput} $active={Number(lastPageInput) === currentPage} onChange={handleLastPageInputChange} onBlur={handleLastPageInputConfirm} onKeyDown={(event) => { if (event.key === 'Enter') { handleLastPageInputConfirm(); event.currentTarget.blur(); }; }} />

                <Select menuPlacement="top" isSearchable={false} options={pageOptions} menuPortalTarget={document.body} components={{ IndicatorSeparator: () => null }} styles={RegistrationSharedStyled.SelectCommonStyles} value={pageOptions.find(option => option.value === pageSize)} onChange={(selectedOption) => { if (selectedOption) { onPageSizeChange(selectedOption.value); onPageChange(1); }; }} />
            </Styled.PagesArray>

            <Styled.PaginationButton onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
                <Styled.PaginationButtonTextRight> Próxima </Styled.PaginationButtonTextRight>

                <ArrowRight size={20} />
            </Styled.PaginationButton>
        </Styled.PaginationContainer>
    );
};

export default Pagination;