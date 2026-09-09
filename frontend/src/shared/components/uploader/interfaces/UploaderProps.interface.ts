import { UploaderItemType } from '../types/UploaderItemType.type';

export interface UploaderProps {
    isExcel?: boolean;
    value: UploaderItemType[];

    onChange: (files: UploaderItemType[]) => void;
};