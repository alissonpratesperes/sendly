import Select, { SingleValue } from 'react-select';

import { SelectCommonStyles } from '../styles/dropdown.style';
import { DropdownProps } from '../interfaces/dropdownProps.interface';

export default function Dropdown<Option>({ width, isInPagination, isClearable, isDisabled, isLoading, options, placeholder, value, isSearchable, onChange, ...props }: DropdownProps<Option>) {
    return (
        <Select<Option>
            isClearable={ isClearable }
            isDisabled={ isDisabled }
            isLoading={ isLoading }
            options={ options }
            placeholder={ placeholder }
            value={ value }

            onChange={ (option: SingleValue<Option>) => onChange(option ?? null) }

            { ...props }

            isMulti={ false }
            menuPosition="fixed"
            isSearchable={ isSearchable }
            closeMenuOnSelect={ true }
            hideSelectedOptions={ false }
            menuPortalTarget={ document.body }
            styles={SelectCommonStyles({ width, isInPagination })}
            components={{ IndicatorSeparator: () => null, ...props.components }}
        />
    );
}
