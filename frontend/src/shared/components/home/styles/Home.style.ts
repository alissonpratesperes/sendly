import styled from 'styled-components';

export const HeaderWrapper = styled.header`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;

export const SessionInformationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;

export const SessionTitle = styled.h1`
    margin-bottom: 7.5px;
    align-self: flex-start;
    font-family: "Inter";
    font-weight: 700;
    font-size: 25px;
    color: #171719;
`;

export const SessionSubtitle = styled.span`
    margin-bottom: 15px;
    align-self: flex-start;
    font-family: "Inter";
    font-weight: 400;
    font-size: 14px;
    color: #525059;
`;

export const IframeContainer = styled.div`
    height: calc(100vh - 180px);
    width: 100%;
`;

export const BullBoardIframe = styled.iframe`
    margin-top: 15px;
    height: 100%;
    width: 100%;
    border: none;
    display: block;
    overflow: hidden;
    border-radius: 14px;
`;
