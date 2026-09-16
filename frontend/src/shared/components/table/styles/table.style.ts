import styled from 'styled-components';

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
