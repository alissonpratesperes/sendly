import { useCallback, useEffect, useMemo } from 'react';

import * as Styled from '../styles/paginate.style';
import { PageOption } from '../types/pageOption.type';
import Dropdown from '../../dropdown/screens/Dropdown';
import { PaginateParams } from '../types/paginateParams.type';

export default function Paginate({ page, total, limit, onPageChange, onLimitChange, }: PaginateParams) {
    const pageOptions: PageOption[] = [
        { value: 5, label: "5" },
        { value: 15, label: "15" },
        { value: 30, label: "30" },
    ];

    const totalPages = useMemo<number>(() => {
        return limit > 0 ? Math.ceil(total / limit) : 1;
    }, [ total, limit ]);

    const goToPage = useCallback((target: number) => {
        if (target >= 1 && target <= totalPages && target !== page) {
            onPageChange(target);
        }
    }, [ page, totalPages, onPageChange ]);

    const nextPage = useCallback(() => {
        goToPage(page + 1);
    }, [ page, goToPage ]);

    const previousPage = useCallback(() => {
        goToPage(page - 1);
    }, [ page, goToPage ]);

    const handleLimitChange = (selectedOption: PageOption | null) => {
        if (selectedOption && onLimitChange) {
            onLimitChange(selectedOption.value);
        }
    }

    const pages = useMemo<(number | string)[]>(() => {
        const pages: (number | string)[] = [ 1, 2 ];

        let start: number;
        let end: number;

        if (totalPages <= 6) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }
        if (page <= 4) {
            start = 3;
            end = 4;
        } else if (page >= totalPages - 2) {
            start = totalPages - 3;
            end = totalPages - 2;
        } else {
            start = page - 1;
            end = page;
        }
        if (start > 3) {
            pages.push("...");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 2) {
            pages.push("...");
            pages.push(totalPages - 1);
        } else if (end === totalPages - 2) {
            pages.push(totalPages - 1);
        }

        pages.push(totalPages);

        return pages;
    }, [ page, totalPages ])

    useEffect(() => {
        if (page < 1) {
            onPageChange(1);

            return;
        }
        if (page > totalPages) {
            onPageChange(totalPages);
        }
    }, [ page, totalPages, onPageChange ])

    return (
        <Styled.PaginateContainer>
            <Styled.PaginateButton disabled={ page === 1 } onClick={ previousPage }>
                <Styled.ArrowLeftIcon />

                <Styled.PreviousButtonText> Anterior </Styled.PreviousButtonText>
            </Styled.PaginateButton>

            <Styled.PagesArrayContainer>
                { pages.map((pageNumber, index) =>
                    pageNumber === "..." ? (
                        <Styled.EllipsisIcon key={ `ellipsis-${index}` } />
                    ) : (
                        <Styled.PageButton key={ `page-${pageNumber}` } $active={ page === pageNumber } onClick={ () => goToPage(pageNumber as number) }> { pageNumber } </Styled.PageButton>
                    )
                ) }

                <Dropdown
                    width="120px"
                    isClearable={ false }
                    isDisabled={ false }
                    isLoading={ false }
                    options={ pageOptions }
                    value={ pageOptions.find(option => option.value === limit) || null }
                    onChange={ handleLimitChange }
                />
            </Styled.PagesArrayContainer>

            <Styled.PaginateButton disabled={ page === totalPages } onClick={ nextPage }>
                <Styled.NextButtonText> Próxima </Styled.NextButtonText>

                <Styled.ArrowRightIcon />
            </Styled.PaginateButton>
        </Styled.PaginateContainer>
    );
}
