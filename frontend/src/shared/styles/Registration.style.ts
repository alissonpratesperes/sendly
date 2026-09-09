import styled from 'styled-components';
import { ArrowDown } from 'lucide-react';

import { AddButtonProps } from '../interfaces/AddButtonProps.interface';
import { SortListingActionProps } from '../interfaces/SortListingActionProps.interface';
import { NotFoundContentContainerProps } from '../interfaces/NotFoundContentContainerProps.interface';

export const CustomOptionsContainer = styled.div`
    padding: 0px 12px 0px 12px;
    height: 45px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 14px;
    color: #171719;
`;

export const CustomOptionsInput = styled.input`
    padding: 8px 12px 8px 12px;
    cursor: pointer;
`;

export const CustomOptionsDiv = styled.div`
    padding: 8px 12px 8px 12px;
`;

export const CustomSelectedAllLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 14px;
    color: #171719;
`;

export const CustomSelectedAllInput = styled.input`
    cursor: pointer; 
`;

export const FieldWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Label = styled.label`
    margin-bottom: 8px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 14px;
    color: #171719;
`;

export const DateInput = styled.input`
    padding: 10px 10px 10px 10px;
    height: 40px;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    background-color: #FFFFFF;
    border: 1px solid #D3D2D9;
    border-radius: 8px;
`;

export const CustomDatePickerWrapper = styled.div`
    .react-datepicker__triangle {
        display: none !important;
    }

    .custom-datepicker-wrapper {
        margin: 0px auto 0px auto;
        width: 100%;
        background: transparent !important;
    }

    .react-datepicker { 
        padding: 16px 16px 16px 16px;
        border: none;
        border-radius: 12px;
        background: #FFFFFF;
        box-shadow: 0px 4px 8px rgba(66, 71, 76, 0.05);
    }

    .custom-header {
        padding: 0px 0px 0px 0px;
        height: 40px;
        position: relative;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: none;
    }

    .react-datepicker__header {
        padding: 0px 0px 0px 0px;
        background-color: #FFFFFF !important;
        border-bottom: none;
    }

    .header-month {
        margin: 0px 0px 0px 0px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        line-height: 24px;
        font-family: 'Inter';
        font-weight: 600;
        font-size: 16px;
        color: #09090B;
        text-transform: capitalize;
    }

    .nav-button {
        height: 40px;
        width: 40px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #FFFFFF;
        border: 1px solid #E4E6E799;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0px 1px 5px -1px rgba(17, 12, 34, 0.10);

            svg {
                font-size: 18px;
            }
    }

    .nav-button.prev {
        left: 0;
    }

    .nav-button.next {
        right: 0;
    }

    .react-datepicker__day-names {
        margin-top: 16px;
        padding-top: 8px;
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
    }

    .react-datepicker__day-names::before {
        height: 1px;
        width: calc(100% + 32px);
        content: '';
        position: absolute;
        top: 0px;
        left: -16px;
        background-color: #F4F4F5;
    }

    .react-datepicker__day-name {
        height: 32px;
        width: 32px;
        line-height: 32px;
        line-height: 18px;
        font-family: 'Inter';
        font-weight: 600;
        font-size: 13px;
        color: #71717A;
        text-align: center;
    }

    .react-datepicker__day--selected, .react-datepicker__day--in-range, .react-datepicker__day--in-selecting-range {
        color: red;
        border-radius: 50%;
        background-color: #FF734A;
    }

    .react-datepicker__day, .custom-day {
        height: 32px;
        width: 32px;
        line-height: 32px;
        font-family: 'Inter';
        font-weight: 600;
        font-size: 14px;
        color: #3F3F46;
        text-align: center;
        border-radius: 50%;
        display: inline-block;
    }
     
    .react-datepicker__month {
        display: grid !important;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-rows: 32px;
        gap: 4px;
        box-sizing: border-box;
        padding: 8px 0;
    }

    .react-datepicker__week {
        display: contents !important;
    }

    .react-datepicker__day:hover {
        color: #FFFFFF;
        border-radius: 50%;
        background-color: #FF734A;
    }
    
    .react-datepicker__day--selected, .react-datepicker__day--in-range, .react-datepicker__day--in-selecting-range {
        color: #FFFFFF;
        border-radius: 50%;
        background-color: #FF734A;
    }
`;

export const SelectCommonStyles = {
    control: (base: any) => ({
        ...base,
        minHeight: '40px',
        height: 'auto',
        borderRadius: 8,
        flexWrap: 'wrap'
    }),

    menuPortal: (base: any) => ({
        ...base,
        zIndex: 9998
    }),

    menu: (base: any) => ({
        ...base,
        maxHeight: '247px',
        width: '100%',
        borderRadius: 8,
        overflowY: 'auto'
    }),

    menuList: (base: any) => ({
        ...base,
        maxHeight: '247px',
        overflowY: 'auto',
        padding: 0
    }),

    option: (base: any) => ({
        ...base,
        paddingLeft: '12px',
        paddingRight: '12px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'Lato',
        fontWeight: 700,
        fontSize: '14px',
        color: '#171719',
        cursor: 'pointer'
    })
};

export const FinancialSelectCommonStyles = {
    control: (base: any) => ({
        ...base,
        width: '107px',
        height: '40px',
        minHeight: '40px',
    }),

    menuPortal: (base: any) => ({
        ...base,
        zIndex: 9999,
        width: '225px'
    }),

    menu: (base: any) => ({
        ...base,
        maxHeight: 'auto',
        width: '225px',
        borderRadius: 8,
        overflow: 'hidden',
    }),

    menuList: (base: any) => ({
        ...base,
        maxHeight: 'auto',
        overflowY: 'auto',
        padding: 0
    }),

    option: (base: any) => ({
        ...base,
        paddingLeft: '12px',
        paddingRight: '12px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'Lato',
        fontWeight: 700,
        fontSize: '14px',
        color: '#171719',
        cursor: 'pointer'
    })
};

export const FinancialSelectPlaceHolderStyle = styled.div`
    font-family: 'Lato';
    font-weight: 400;
    font-size: 16px;
    color: #767380;
`;

export const HeaderWrapper = styled.header`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;

export const GoBackButton = styled.button`
    background: none;
    cursor: pointer;
    outline: none;
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: #1C70E9;
`;

export const GoBackButtonLabel = styled.span`
    margin-left: 5px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 16px;
`;

export const SessionInformationWrapper = styled.div`
    margin: 10px 0px 10px 0px;
    height: 73px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;

export const SessionTitle = styled.h1`
    height: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 24px;
    color: #171719;
`;

export const SessionSubtitle = styled.h3`
    font-family: 'Lato';
    font-weight: 400;
    font-size: 14px;
    color: #525059;
`;

export const ListWrapper = styled.div``;

export const SearchInputWrapper = styled.div`
    margin-bottom: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 8px;
`;

export const SearchInputContainer = styled.div`
    padding: 0px 10px 0px 10px;
    height: 40px;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    background-color: #FFFFFF;
    border: 1px solid #D3D2D9;
    border-radius: 8px;
`;

export const SearchInputField = styled.input`
    margin-left: 5px;
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 16px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;

        &::placeholder {
            font-family: 'Lato';
            font-weight: 400;
            font-size: 16px;
            color: #767380;
        }
`;

export const AddButton = styled.button<AddButtonProps>`
    height: 40px; 
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    background-color: #00355D;
    border-radius: 8px;

    width: ${({ $isInFinancialPage, $isInActionTypePage }) => $isInFinancialPage || $isInActionTypePage ? '225px' : '194px'}; 
`;

export const SearchInputSubmitText = styled.span`
    margin-left: 5px;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 16px;
`;

export const TableWrapper = styled.div`
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #E9EAEB;
`;

export const TableListWrapper = styled.table`
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
`;

export const TableListHeaderRow = styled.tr`
    height: 44px;
    background-color: #F9FAFB;
`;

export const TableListHeaderRowColumn = styled.th`
    padding: 12px 24px 12px 24px;
    text-align: left;
    font-family: 'Inter';
    font-weight: 600;
    font-size: 12px;
    color: #535862;
    text-align: left;
    border-bottom: 1px solid #E9EAEB;

        &:nth-last-child(2) {
            width: 137px;
            vertical-align: middle;
            text-align: start;
            cursor: pointer;
        }
        &:nth-last-child(1) {
            width: 116px;
        }
`;

export const SortArrow = styled(ArrowDown) <SortListingActionProps>`
    margin-left: 5px;
    vertical-align: middle;
    transform: ${({ $isAsc }) => ($isAsc ? 'rotate(0deg)' : 'rotate(180deg)')};
`;

export const TableListBodyRow = styled.tr`
    padding: 16px 24px 16px 24px;
    height: 72px;
    background-color: #FFFFFF;
    border-bottom: 1px solid #E9EAEB;
`;

export const TableListBodyRowData = styled.td`
    padding: 16px 24px 16px 24px;
    vertical-align: middle;
    
        &:nth-last-child(1) { 
            text-align: center;
        
                button + button {
                    margin-left: 20px;
                }
        }
`;

export const TableListBodyRowDataActionButton = styled.button`
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    color: #535862;
`;

export const NotFoundContentContainer = styled.div`
    margin-top: 100px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const NotFoundContentIllustration = styled.div<NotFoundContentContainerProps>`
    height: 343.34px;
    width: 290.98px;
    background-size: contain;
    background-position: center; 
    background-repeat: no-repeat;

    background-image: url(${props => props.src});
`;

export const WithoutFoundContentText = styled.p`
    font-family: 'Inter';
    font-weight: 500;
    font-size: 16px;
    color: #767380;
`;