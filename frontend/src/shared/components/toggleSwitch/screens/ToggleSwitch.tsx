import React from 'react';

import * as S from '../styles/ToggleSwitch.style';

import { ToggleSwitchSliderProps } from '../interfaces/ToggleSwitchSliderProps.interface';

export const ToggleSwitch: React.FC<ToggleSwitchSliderProps> = ({ checked, onChange }) => {
    return (
        <S.SwitchWrapper>
            <S.HiddenCheckbox type="checkbox" checked={ checked } onChange={ onChange }/>

            <S.Slider $checked={ checked }>
                <S.SliderCircle $checked={ checked }/>
            </S.Slider>
        </S.SwitchWrapper>
    );
}
