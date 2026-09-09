import React from 'react';
import { Check, X } from 'lucide-react';

import * as Styled from '../styles/ToggleSwitch.style';
import { ToggleSwitchSliderProps } from '../interfaces/ToggleSwitchSliderProps.interface';

const ToggleSwitch: React.FC<ToggleSwitchSliderProps> = ({ checked, onChange, label }) => {
    return (
        <Styled.SwitchWrapper>
            <Styled.HiddenCheckbox type="checkbox" checked={checked} onChange={onChange} />

            <Styled.Slider $checked={checked}>
                <Styled.SliderIcon $checked={checked}>
                    {checked ? <Check size={12} color="#FFFFFF" /> : <X size={12} color="#6B7280" />}
                </Styled.SliderIcon>

                <Styled.SliderCircle $checked={checked} />
            </Styled.Slider>

            {label && <Styled.LabelText>{checked ? 'Ativo' : 'Inativo'}</Styled.LabelText>}
        </Styled.SwitchWrapper>
    );
};

export default ToggleSwitch;