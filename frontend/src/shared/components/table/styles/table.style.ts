import styled from 'styled-components';

import { TableListColorFragmentProps } from '../../../interfaces/tableListColorFragmentProps.interface';

export const TableWrapper = styled.div`
    width: 100%;
    overflow-x: auto;
`;

export const TableListWrapper = styled.table`
    width: 100%;
    table-layout: auto;
    border-spacing: 0 15px;
    background: transparent;
    border-collapse: separate;
`;

export const TableListHeaderRow = styled.tr`
    background: transparent;
`;

export const TableListHeaderRowColumn = styled.th`
    padding-left: 25px;
    text-transform: uppercase;
    font-family: "Lato";
    font-weight: 900;
    font-size: 13px;
    color: #1C70E9;
    text-align: left;
`;

export const TableListBodyRowData = styled.td`
    padding: 15px 25px;
    white-space: pre-line;
    vertical-align: middle;
    background: transparent;

        &:last-of-type {
            width: 140px;
            min-width: 200px;
            max-width: 200px;
            text-align: center;

            button + button {
                margin-left: 15px;
            }
        }
`;

export const TableListBodyRowDataActions = styled.div` width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    opacity: 0;
    white-space: nowrap;
    transform: translateX(-20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
`;

export const TableListBodyRow = styled.tr`
    height: 85px;
    display: table-row;
    border-radius: 14px;
    background-color: #FFFFFF;
    clip-path: inset(0 round 14px);

        &:hover {
            ${ TableListBodyRowDataActions } {
                opacity: 1;
                transform: translateX(0);
            }
        }
`;

export const TableListBodyRowDataActionButton = styled.button`
    height: 55px;
    width: 55px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
    cursor: pointer;
    background: transparent;
    border-radius: 50px;

        &:hover {
            animation: tableButtonEffect 0.6s ease-in-out;
        }

            &:first-child {
                background-color: #E6F4EA;
            }
            &:nth-child(2) {
                background-color: #FCE8E6;
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

export const TableListColorFragment = styled.div<TableListColorFragmentProps>`
    width: 25px;
    height: 25px;
    min-width: 25px;
    min-height: 25px;
    flex: 0 0 25px;
    border-radius: 50%;
    vertical-align: middle;

    background-color: ${ ({ $color }) => $color };
`;

export const TableListColorContent = styled.div`
    min-width: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 30px;
`;

export const ContactNameSpan = styled.span `
    min-width: 0;
    flex: 1;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
`;
