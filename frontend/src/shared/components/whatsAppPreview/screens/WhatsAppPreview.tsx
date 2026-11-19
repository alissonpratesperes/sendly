import { createPortal } from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';

import * as S from '../styles/whatsAppPreview.style';

import { WhatsAppPreviewProps } from '../interfaces/whatsAppPreviewProps.interface';

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({ header, body, footer, image, isClosing = false, onAnimationEnd, }) => {
    const [isRead, setIsRead] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>();

    const hasContent = Boolean(header || body || footer || image);
    const enterTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const openedPreviewDate: string = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", });

    const getParallaxPosition = (element: HTMLDivElement, clientX: number, clientY: number) => {
        const intensity = 20;
        const rect = element.getBoundingClientRect();
        const xAxisPosition = (clientX - rect.left) / rect.width - 0.5;
        const yAxisPosition = (clientY - rect.top) / rect.height - 0.5;

        return `${ 50 + xAxisPosition * intensity }% ${ 50 + yAxisPosition * intensity }%`;
    }
    const handleWallpaperEnter = (event: React.MouseEvent<HTMLDivElement>) => {
        const element = event.currentTarget;

        if (enterTimeout.current) {
            clearTimeout(enterTimeout.current);
        }

        element.classList.add("smooth");
        element.style.backgroundPosition = getParallaxPosition(element, event.clientX, event.clientY);

        enterTimeout.current = setTimeout(() => {
            element.classList.remove("smooth");
        }, 350);
    }
    const handleWallpaperMove = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.style.backgroundPosition = getParallaxPosition(event.currentTarget, event.clientX, event.clientY);
    }
    const handleWallpaperLeave = (event: React.MouseEvent<HTMLDivElement>) => {
        const element = event.currentTarget;

        if (enterTimeout.current) {
            clearTimeout(enterTimeout.current);
        }

        element.classList.add("smooth");
        element.style.backgroundPosition = "50% 50%";
    }

    useEffect(() => {
        if (!hasContent) {
            setIsRead(false);

            return;
        }

        setIsRead(false);

        const timer = setTimeout(() => {
            setIsRead(true);
        }, 700);

        return () => clearTimeout(timer);
    }, [ hasContent, ]);
    useEffect(() => {
        if (!image) {
            setImageUrl(undefined);

            return;
        }
        if (typeof image === "string") {
            setImageUrl(image);

            return;
        }

        const url = URL.createObjectURL(image);

        setImageUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [ image, ]);
    useEffect(() => {
        return () => {
            if (enterTimeout.current) {
                clearTimeout(enterTimeout.current);
            }
        };
    }, []);

    return createPortal(
        <S.WhatsAppPanel>
            <S.WhatsAppPanelAnimation $isClosing={ isClosing } onAnimationEnd={ onAnimationEnd }>
                <S.WhatsAppChatContainer>
                    <S.WhatsAppChatBody onMouseEnter={ handleWallpaperEnter } onMouseMove={ handleWallpaperMove } onMouseLeave={ handleWallpaperLeave }>
                        { hasContent && (
                            <S.WhatsAppMessageBubble>
                                { imageUrl && ( <S.WhatsAppMessageImage src={ imageUrl }/> ) }
                                { header && ( <S.WhatsAppMessageHeader> { header } </S.WhatsAppMessageHeader> ) }
                                { body && ( <S.WhatsAppMessageBody> { body } </S.WhatsAppMessageBody> ) }
                                { footer && ( <S.WhatsAppMessageFooter> { footer } </S.WhatsAppMessageFooter> ) }

                                <S.WhatsAppMessageReadFeedback>
                                    <S.WhatsAppMessageReadFeedbackHour> { openedPreviewDate } </S.WhatsAppMessageReadFeedbackHour>

                                    <S.WhatsAppMessageReadFeedbackIcon $isRead={ isRead }/>
                                </S.WhatsAppMessageReadFeedback>
                            </S.WhatsAppMessageBubble>
                        ) }
                    </S.WhatsAppChatBody>
                </S.WhatsAppChatContainer>
            </S.WhatsAppPanelAnimation>
        </S.WhatsAppPanel>,

            document.body
    );
}
