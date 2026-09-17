import styled from 'styled-components';

import { ToggleSwitchProps } from '../interfaces/ToggleSwitchProps.interface';

export const SwitchWrapper = styled.label`
    height: 55px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
`;

export const HiddenCheckbox = styled.input`
    height: 0;
    width: 0;
    position: absolute;
    opacity: 0;
`;

export const Slider = styled.div<ToggleSwitchProps>`
    height: 29px;
    width: 52px;
    position: relative;
    border-radius: 9999px;
    transition: background-color 0.6s ease-in-out;

    background-color: ${ ({ $checked }) => ($checked ? "#1C70E9" : "#D1D5DB") };
`;

export const SliderCircle = styled.div<ToggleSwitchProps>`
    height: 25px;
    width: 25px;
    position: absolute;
    top: 2px;
    background-color: #FFFFFF;
    border-radius: 50%;
    transition: left 0.3s ease;

    left: ${ ({ $checked }) => ($checked ? "25px" : "2px") };
`;
