export type TemplateContent = {
    header?: {
        title?: string;
    };
    body: Array<{
        type: "text" | "image";
        text?: string;
        url?: string;
    }>;
    footer?: {
        text?: string;
    };
};