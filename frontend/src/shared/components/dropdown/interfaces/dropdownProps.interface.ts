import { Props as SelectProps } from 'react-select';

export interface DropdownProps<Option> extends Omit<SelectProps<Option, false>, "onChange"> {
    width?: string;
    isInPagination?: boolean;

    isClearable: boolean;
    isDisabled: boolean;
    isLoading: boolean;
    options: Option[];
    placeholder?: string;
    value: Option | null;
    isSearchable: boolean;

    onChange: (value: Option | null) => void;
}
