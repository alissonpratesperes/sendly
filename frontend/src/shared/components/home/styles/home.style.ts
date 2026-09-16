import styled from 'styled-components';

export const HeaderWrapper = styled.header`
    margin-top: -170px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const SessionInformationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const SessionTitle = styled.h1`
    margin-bottom: 7.5px;
    font-family: "Inter";
    font-weight: 900;
    font-size: 25px;
    color: #1C70E9;
`;

export const SessionSubtitle = styled.span`
    margin-bottom: 30px;
    align-self: flex-start;
    font-family: "Inter";
    font-weight: 500;
    font-size: 18px;
    color: #1C70E9;
`;

export const IframeContainer = styled.div`
    height: calc(100vh - 180px);
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const BullBoardIframe = styled.iframe`
    height: 100%;
    width: 97%;
    border: none;
    display: block;
    overflow: hidden;
    border-radius: 14px;
`;
