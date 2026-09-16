import { UploaderItemType } from '../types/uploaderItemType.type';

export interface UploaderProps {
    isExcel?: boolean;
    value?: UploaderItemType;

    onChange: (file?: UploaderItemType) => void;
}
