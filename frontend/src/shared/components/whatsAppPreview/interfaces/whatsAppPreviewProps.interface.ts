export interface WhatsAppPreviewProps {
    header: string;
    body: string;
    footer: string;
    image?: File | string;
    isClosing?: boolean;

    onAnimationEnd?: () => void;
}
