import { keyframes } from 'styled-components';

export const AnimateTabIcon = keyframes`
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(-14deg); }
    40% { transform: rotate(14deg); }
    60% { transform: rotate(-12deg); }
    80% { transform: rotate(12deg); }
`;

export const AnimateHeaderIcon = keyframes`
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(-14deg); }
    40% { transform: rotate(14deg); }
    60% { transform: rotate(-12deg); }
    80% { transform: rotate(12deg); }
`;

export const AnimateButtonHover = keyframes`
    0% { transform: scale(1.08); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
`;

export const AnimateDrawerOpening = keyframes`
    0% { transform: translateX(calc(100% + 30px)); }
    70% { transform: translateX(-15px); }
    100% { transform: translateX(0); }
`;

export const AnimateDrawerClosing = keyframes`
    0% { transform: translateX(0); }
    30% { transform: translateX(-15px); }
    100% { transform: translateX(calc(100% + 30px)); }
`;

export const AnimateModalOpening = keyframes`
    0% { transform: translateY(100px) scale(0.9); }
    70% { transform: translateY(-10px) scale(1.02); }
    100% { transform: translateY(0) scale(1); }
`;

export const AnimateModalClosing = keyframes`
    0% { transform: translateY(0) scale(1); }
    30% { transform: translateY(-10px) scale(1.02); }
    100% { transform: translateY(100px) scale(0.9); }
`;

export const AnimatePreviewOpening = keyframes`
    0% { transform: scale(0.75) translateX(40px); opacity: 0; }
    60% { transform: scale(1.03) translateX(0); opacity: 1; }
    100% { transform: scale(1) translateX(0); opacity: 1; }
`;

export const AnimatePreviewClosing = keyframes`
    0% { transform: scale(1) translateX(0); opacity: 1; }
    40% { transform: scale(1.03) translateX(0); opacity: 1; }
    100% { transform: scale(0.75) translateX(40px); opacity: 0; }
`;

export const AnimateMesssagePopping = keyframes`
    0% { transform: scale(1.08); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
`;
