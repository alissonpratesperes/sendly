import styled from 'styled-components';
import { CheckCheck } from 'lucide-react';

import { whatsAppMesssagePopAnimation, whatsAppPreviewCloseAnimation, whatsAppPreviewOpenAnimation } from '../../../styles/Global.style';

export const WhatsAppPanel = styled.aside`
    width: 500px;
    position: fixed;
    top: 50%;
    right: 560px;
    transform: translateY(-50%);
    z-index: 999;
`;

export const WhatsAppPanelAnimation = styled.div<{ $isClosing: boolean }>`
    will-change: transform;

    animation: ${ ({ $isClosing }) => $isClosing ? whatsAppPreviewCloseAnimation : whatsAppPreviewOpenAnimation } 0.6s ease-in-out forwards;
`;

export const WhatsAppChatContainer = styled.div`
    width: 100%;
    background: #E5DDD5;
    border-radius: 26px;
    overflow: hidden;
`;

export const WhatsAppChatBody = styled.div`
    padding: 30px;
    height: 800px;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    background-image: url("/whatsappbrackground.png");
    background-size: 150%;
    background-position: 50% 50%;
    background-repeat: no-repeat;

        &::-webkit-scrollbar {
            width: 10px;
        }
        &::-webkit-scrollbar-track {
            margin-top: 14px;
            margin-bottom: 14px;
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background: #C5C5C5;
            border-radius: 10px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #AAAAAA;
        }

            &.smooth {
                transition: background-position 350ms cubic-bezier(0.22, 1, 0.36, 1);
            }
`;

export const WhatsAppMessageBubble = styled.div`
    padding: 7.5px;
    margin-left: auto;
    margin-right: 0;
    max-width: 90%;
    min-width: 180px;
    width: fit-content;
    position: relative;
    background-color: #D9FDD3;
    border-radius: 16px;
    border-top-right-radius: 0;
    box-shadow: 0 3.5px 7px rgba(0,0,0,.1);
    overflow: visible;
    transform-origin: top right;

    animation: ${ whatsAppMesssagePopAnimation } 0.6s ease-in-out;

        &::after {
            margin-top: -1px;
            width: 8px;
            content: "";
            position: absolute;
            top: 0;
            right: -8px;
            height: 13px;
            background-repeat: no-repeat;
            background-size: contain;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 13' width='8' height='13'%3E%3Cpath fill='%23d9fdd3' d='M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z'/%3E%3C/svg%3E");
        }
`;

export const WhatsAppMessageImage = styled.img`
    display: block;
    height: auto;
    width: 100%;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 8px;
`;

export const WhatsAppMessageHeader = styled.div`
    margin-left: 8px;
    margin-bottom: 8px;
    padding-right: 30px;
    font-family: "Inter";
    font-weight: 700;
    font-size: 16px;
    color: #171719;
    word-break: break-word;
    overflow-wrap: break-word;
`;

export const WhatsAppMessageBody = styled.p`
    margin: 0;
    padding-left: 8px;
    padding-right: 30px;
    font-family: "Inter";
    font-weight: 400;
    font-size: 14px;
    color: #171719;
    line-height: 1.5;
    word-break: break-word;
    overflow-wrap: break-word;
`;

export const WhatsAppMessageFooter = styled.div`
    margin-top: 8px;
    padding-left: 8px;
    padding-right: 30px;
    font-family: "Inter";
    font-weight: 400;
    font-style: italic;
    font-size: 12px;
    color: #667781;
    word-break: break-word;
    overflow-wrap: break-word;
`;

export const WhatsAppMessageReadFeedback = styled.div`
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
`;

export const WhatsAppMessageReadFeedbackIcon = styled(CheckCheck)<{ $isRead: boolean }>`
    width: 25px;
    height: 25px;
    transition: color 0.6s ease;

    color: ${ ({ $isRead }) => $isRead ? "#53BDEB" : "#8696A0" };
`;
