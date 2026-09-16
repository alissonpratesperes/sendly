export type UploaderItemType =
    | File
    | {
        url: string;
        name: string;
        size: number;
        contentType?: string;
    }
