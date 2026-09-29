import { UploaderItemType } from '../types/uploaderItemType.type';

export interface UploaderProps {
    isCsv?: boolean;
    value?: UploaderItemType;
    existingImage?: string;
    shouldEdit?: boolean;

    onRemoveExistingImage?: () => void;
    onChange: (file?: UploaderItemType) => void;
}
