import styled from 'styled-components';

export const SelectCommonStyles = {
    control: (base: any) => ({
        ...base,
        minHeight: '40px',
        borderRadius: 8
    }),

    menu: (base: any) => ({
        ...base,
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden'
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

export const FilterCard = styled.div`
    width: auto;
    padding: 16px 16px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 8px; 
    background-color: #FFFFFF;
    box-shadow: 0px 2px 9px 0px #98A0B440;
`;

export const FilterCardTitles = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const FilterCardMainTitle = styled.p`
    line-height: 24px;
    font-family: 'Inter';
    font-weight: 600;
    font-size: 20px;
    color: #4B4B4B;
`;

export const ClearFilters = styled.button`
    line-height: 20px;
    font-family: 'Inter';
    font-weight: 500;
    font-size: 14px;
    color: #2B67F6;
    background: none;
    border: none;
    cursor: pointer;
`;

export const ApplyButton = styled.button`
    height: 40px; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 16px;
    color: #FFFFFF;
    border-radius: 8px;
    cursor: pointer;
    background-color: #00355D;
`;

export const ContentWrapper = styled.div`
    margin-top: 32px;
    display: flex;
    flex-direction: row;
    gap: 32px;
`;

export const FilterCardContainer = styled.div`
    width: 357px;
    flex-shrink: 0;
    overflow: visible;
`;

export const CardGrid = styled.div`
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
`;

export const StandalonePagination = styled.div`
    margin-top: 30px;
    border-radius: 10px;
    box-shadow: 0px 2px 9px 0px #98A0B440;
`;