import { Props as SelectProps } from 'react-select';

export interface DropdownProps<Option> extends Omit<SelectProps<Option, false>, "onChange"> {
    width?: string;

    isClearable: boolean;
    isDisabled: boolean;
    isLoading: boolean;
    options: Option[];
    placeholder?: string;
    value: Option | null;

    onChange: (value: Option | null) => void;
}
