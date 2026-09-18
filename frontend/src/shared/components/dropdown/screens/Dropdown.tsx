import Select from 'react-select';

import { SelectCommonStyles } from '../styles/dropdown.style';
import { DropdownProps } from '../interfaces/dropdownProps.interface';

export default function Dropdown<Option>({
    width = "100%",
    isInPagination,
    onChange,
    components,
    menuPosition = "fixed",
    closeMenuOnSelect = true,
    hideSelectedOptions = false,
    menuPortalTarget = document.body,
    ...props
}: DropdownProps<Option>) {
    return (
        <Select<Option, false>
            { ...props }
            isMulti={ false }
            onChange={ (option) => onChange(option ?? null) }
            menuPosition={ menuPosition }
            closeMenuOnSelect={ closeMenuOnSelect }
            hideSelectedOptions={ hideSelectedOptions }
            menuPortalTarget={ menuPortalTarget }
            styles={ SelectCommonStyles({ width, isInPagination, }) }
            components={ { IndicatorSeparator: () => null, ...components, } }
        />
    );
}
