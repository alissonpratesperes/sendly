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
    padding-left: 20px;
    text-transform: uppercase;
    font-family: "Lato";
    font-weight: 900;
    font-size: 14px;
    color: #223463;
    text-align: left;
`;

export const TableListBodyRowData = styled.td<{ $isInBatchScreen?: boolean }>`
    padding: 20px;
    white-space: pre-line;
    vertical-align: middle;
    background: #FFFFFF;

        ${({ $isInBatchScreen }) => !$isInBatchScreen && `
            &:last-of-type {
                width: 110px;
                min-width: 110px;
                text-align: center;
            }
        `}
`;

export const TableListBodyRowDataActions = styled.div`
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const TableListBodyRow = styled.tr`
    height: 85px;
    display: table-row;
    border-radius: 14px;
    background-color: #FFFFFF;
    clip-path: inset(0 round 14px);
`;

export const TableListBodyRowDataActionButton = styled.button`
    height: 55px;
    width: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
    cursor: pointer;
    transition: background 0.3s ease, color 0.3s ease;

        &:first-child {
            color: #238636;
            background-color: #E6F4EA;
            border-top-left-radius: 14px;
            border-bottom-left-radius: 14px;
        }
        &:nth-child(2) {
            color: #DC143C;
            background-color: #FCE8E6;
            border-top-right-radius: 14px;
            border-bottom-right-radius: 14px;
        }
        &:hover {
            animation: tableButtonEffect 0.6s ease-in-out;
        }
        &:first-child:hover {
            color: #FFFFFF;
            background-color: #238636;
        }
        &:nth-child(2):hover {
            color: #FFFFFF;
            background-color: #DC143C;
        }
        &:only-child {
            color: #223463;
            background-color: #E8EEF8;
            border-radius: 14px;
        }
        &:only-child:hover {
            color: #FFFFFF;
            background-color: #223463;
            border-radius: 14px;

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

export const ContactNameSpan = styled.span`
    min-width: 0;
    flex: 1;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
`;

export const BatchFilterWrapper = styled.div`
    margin-bottom: 30px;
`;
