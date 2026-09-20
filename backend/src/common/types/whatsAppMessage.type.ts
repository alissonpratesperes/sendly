export type WhatsAppMessage =
    | {
        type: "text";
        text: string;
    }
    | {
        type: "image";
        text: string;
        imagePath: string;
    }
