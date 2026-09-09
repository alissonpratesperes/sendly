import styled, { keyframes } from 'styled-components';

export const Overlay = styled.div`
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0px;
    left: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    z-index: 9999;
`;

export const LoadingContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const LoadingLogotype = styled.img`
    height: 160px;
    width: 250px;
    margin-bottom: 16px;
    object-fit: contain;
`;

export const LoadingBarWrapper = styled.div`
    margin: 12px auto 0px auto;
    height: 8px;
    width: 200px;
    position: relative;
    border-radius: 8px;
    background-color: rgba(245, 245, 245, 0.5);
    overflow: hidden;
`;

export const loadingAnimation = keyframes`
    0% { left: -35%;  right: 100%; }
    60% { left: 100%; right: -90%; }
    100% { left: 100%; right: -90%; }
`;

export const LoadingBar = styled.div`
    height: 100%;
    position: absolute;
    will-change: left, right;
    background-color: #1C70E9;
    animation: ${loadingAnimation} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
`;