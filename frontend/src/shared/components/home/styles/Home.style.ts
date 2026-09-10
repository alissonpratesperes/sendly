import styled from 'styled-components';

export const IframeContainer = styled.div`
    height: calc(100vh - 180px);
    width: 100%;
`;

export const BullBoardIframe = styled.iframe`
    height: 100%;
    width: 100%;
    border: none;
    display: block;
    overflow: hidden;
    border-radius: 10px;
`;













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
