import { Funnel } from 'lucide-react';
import Select, { components, type ControlProps } from 'react-select';

import { SelectCommonStyles } from '../styles/dropdown.style';
import { DropdownProps } from '../interfaces/dropdownProps.interface';

export default function Dropdown<Option>({
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
            <Funnel size={ 25 } color="#1C70E9" style={{ marginLeft: 15, flexShrink: 0 }} />

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
