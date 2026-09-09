import styled from 'styled-components';

export const PaginationContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const PaginationButton = styled.button`
    padding: 6px 12px 6px 12px;
    height: 36px;
    width: 108px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: none;
    cursor: pointer;
    outline: none;
    border: none;
    border: 1px solid #D5D7DA;
    background-color: #FFFFFF;
    border-radius: 8px;
    font-family: 'Inter';
    font-weight: 600;
    font-size: 14px;
    color: #414651;

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
`;

export const PaginationButtonTextLeft = styled.span`
    margin-left: 5px;
`;

export const PaginationButtonTextRight = styled.span`
    margin-right: 5px;
`;

export const PagesArray = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

export const EllipsisButton = styled.span`
    padding: 6px 10px 6px 10px;
`;

export const PageButton = styled.button<{ $active?: boolean }> `
    margin-left: 0 !important;
    padding: 6px 10px 6px 10px;
    height: 40px;
    width: 40px;
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 8px;
    font-family: 'Inter';
    font-weight: 500;
    font-size: 14px;
    font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
    color: ${({ $active }) => ($active ? '#252B37' : '#535862')};
    background-color: ${({ $active }) => ($active ? '#FAFAFA' : '#FFFFFF')};
`;

export const LastPageInput = styled.input<{ $active?: boolean }>`
    padding-left: 8px;
    height: 40px;
    width: 50px;
    outline: none;
    border: none;
    border-radius: 8px;
    text-align: left;
    border: 1px solid #D3D2D9;
    text-align: left;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 16px;

    font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
    color: ${({ $active }) => ($active ? '#252B37' : '#767380')};
    background-color: ${({ $active }) => ($active ? '#FAFAFA' : '#FFFFFF')};
`;