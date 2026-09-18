import { Props as SelectProps } from 'react-select';

export interface DropdownProps<Option> extends Omit<SelectProps<Option, false>, "onChange" | "isMulti"> {
    width?: string;
    isInPagination?: boolean;

    onChange: (value: Option | null) => void;
}
