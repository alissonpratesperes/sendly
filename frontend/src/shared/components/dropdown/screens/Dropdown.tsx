import Select, { components, type ControlProps } from 'react-select';

import { DropdownProps } from '../interfaces/dropdownProps.interface';
import { SelectCommonStyles, SelectFilterIcon } from '../styles/dropdown.style';

export function Dropdown<Option>({
    width = "100%",
    isInPagination,
    isInBatchSendScreen,
    onChange,
    components: customComponents,
    menuPosition = "fixed",
    closeMenuOnSelect = true,
    hideSelectedOptions = false,
    menuPortalTarget = document.body,
    ...props
}: DropdownProps<Option>) {
    const CustomControl = (controlProps: ControlProps<Option, false>) => (
        <components.Control { ...controlProps }>
            { !isInPagination && ( <SelectFilterIcon/> ) }
            { controlProps.children }
        </components.Control>
    );

    return (
        <Select<Option, false>
            { ...props }
            isMulti={ false }
            onChange={ (option) => onChange(option ?? null) }
            menuPosition={ menuPosition }
            closeMenuOnSelect={ closeMenuOnSelect }
            hideSelectedOptions={ hideSelectedOptions }
            menuPortalTarget={ menuPortalTarget }
            styles={ SelectCommonStyles({ width, isInPagination, isInBatchSendScreen, }) }
            components={{ ...customComponents, IndicatorSeparator: () => null, Control: CustomControl, }}
        />
    );
}
