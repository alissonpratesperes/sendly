import styled from 'styled-components';

import { TableListColorFragmentProps } from '../interfaces/tableListColorFragmentProps.interface';

export const LoadingContainer = styled.div`
    height: 300px;
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: transparent;
`;

export const ListWrapper = styled.div``;

export const SearchInputWrapper = styled.div`
    margin-top: 30px;
    margin-bottom: 30px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 30px;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
`;

export const SearchInputContainer = styled.div`
    padding: 0px 15px;
    height: auto;
    width: 100%;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    border-radius: 14px;
    background-color: #FFFFFF;

        &::before {
            content: "";
            position: absolute;
            inset: -6px;
            border-radius: 18px;
            border: 2px solid #223463;
            opacity: 0;
            transform: scale(1.08);
            transition: transform 0.3s ease, opacity 0.3s ease;
            pointer-events: none;
        }
        &:focus-within::before {
            opacity: 1;
            transform: scale(1);
        }
`;

export const SearchInputField = styled.input`
    margin-left: 15px;
    height: 55px;
    width: 100%;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
    color: #212121;
    border: none;
    outline: none;
    background-color: #FFFFFF;
    border-radius: 14px;
    z-index: 1;

        &::placeholder {
            color: #BDBDBD;
        }
`;

export const AddButton = styled.button`
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 700;
    font-size: 16px;
    color: #238636;
    border: none;
    outline: none;
    border-radius: 14px;
    border: 2px solid #238636;
    background-color: transparent;
    cursor: pointer;
    transition: color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #FFFFFF;
            background-color: #238636;
            animation: addButtonEffect 0.6s ease-in-out;
        }

            svg {
                stroke: currentColor;
            }

                @keyframes addButtonEffect {
                    0% {
                        transform: scale(1.08);
                    }

                    50% {
                        transform: scale(0.95);
                    }

                    100% {
                        transform: scale(1);
                    }
                }
`;

export const SearchInputSubmitText = styled.span`
    margin-left: 7.5px;
`;

export const TableWrapper = styled.div`
    overflow: hidden;
    border-radius: 14px;
`;

export const TableListWrapper = styled.table`
    width: 100%;
    table-layout: auto;
    border-collapse: collapse;
`;

export const TableListHeaderRow = styled.tr`
    height: auto;
    background-color: #E6E7EC;
`;

export const TableListHeaderRowColumn = styled.th`
    padding: 15px 25px 15px 25px;
    text-transform: uppercase;
    font-family: "Inter";
    font-weight: 700;
    font-size: 13px;
    color: #535862;
    text-align: left;

        &:nth-last-child(2) {
            width: 137px;
            text-align: start;
            vertical-align: middle;
            cursor: pointer;
        }
        &:nth-last-child(1) {
            width: 116px;
        }
`;

export const TableListBodyRow = styled.tr`
    padding: 15px 25px 15px 25px;
    height: 75px;
    background-color: #FFFFFF;
    border-bottom: 1px solid #E6E7EC;
`;

export const TableListBodyRowData = styled.td`
    padding: 15px 25px 15px 25px;
    vertical-align: middle;
    white-space: pre-line;

        &:nth-last-child(1) {
            text-align: center;

                button + button {
                    margin-left: 20px;
                }
        }
`;

export const TableListColorFragment = styled.div<TableListColorFragmentProps>`
    height: 25px;
    width: 25px;
    border-radius: 50%;
    vertical-align: middle;
    background-color: ${ ({ $color }) => $color };
`;

export const TableListColorContent = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 30px;
`;

export const TableListBodyRowDataActions = styled.div`
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const TableListBodyRowDataActionButton = styled.button`
    border: none;
    outline: none;
    background: none;
    cursor: pointer;

        &:hover {
            animation: tableButtonEffect 0.6s ease-in-out;
        }

            @keyframes tableButtonEffect {
                0% {
                    transform: scale(1.08);
                }

                50% {
                    transform: scale(0.95);
                }

                100% {
                    transform: scale(1);
                }
            }
`;

export const FooterPaginateWrapper = styled.div``;

export const NotFoundRegisterContainer = styled.div`
    height: 300px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export const NotFoundRegisterText = styled.div`
    margin-top: 30px;
    font-family: "Inter";
    font-weight: 900;
    font-size: 18px;
    color: #535862;
`;