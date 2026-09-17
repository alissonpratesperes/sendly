import React from 'react';

import * as Styled from '../styles/ToggleSwitch.style';
import { ToggleSwitchSliderProps } from '../interfaces/ToggleSwitchSliderProps.interface';

const ToggleSwitch: React.FC<ToggleSwitchSliderProps> = ({ checked, onChange }) => {
    return (
        <Styled.SwitchWrapper>
            <Styled.HiddenCheckbox type="checkbox" checked={ checked } onChange={ onChange } />

            <Styled.Slider $checked={ checked }>
                <Styled.SliderCircle $checked={ checked } />
            </Styled.Slider>
        </Styled.SwitchWrapper>
    );
}

export default ToggleSwitch;
