import { UploaderItemType } from '../types/uploaderItemType.type';

export interface UploaderProps {
    isExcel?: boolean;
    value?: UploaderItemType;
    existingImage?: string;

    onRemoveExistingImage: () => void;
    onChange: (file?: UploaderItemType) => void;
}
