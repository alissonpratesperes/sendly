import styled from 'styled-components';

import { ToggleSwitchProps } from '../interfaces/ToggleSwitchProps.interface';

export const SwitchWrapper = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
`;

export const HiddenCheckbox = styled.input`
    height: 0;
    width: 0;
    opacity: 0;
    position: absolute;
`;

export const Slider = styled.div<ToggleSwitchProps>`
    height: 24px;
    width: 48px;
    position: relative;
    border-radius: 9999px;
    background-color: ${ ({ $checked }) => ($checked ? "#1C70E9" : "#D1D5DB") };

        &::before {
            content: "";
            height: 20px;
            width: 20px;
            position: absolute;
            left: ${ ({ $checked }) => ($checked ? "26px" : "2px") };
            top: 2px;
            background-color: #fff;
            border-radius: 50%;
        }
`;

export const SliderIcon = styled.div<ToggleSwitchProps>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;

    ${ ({ $checked }) => ($checked ? "left: 6px;" : "right: 6px;") }
`;

export const SliderCircle = styled.div<ToggleSwitchProps>`
    height: 20px;
    width: 20px;
    position: absolute;
    top: 2px;
    left: ${ ({ $checked }) => ($checked ? "26px" : "2px") };
    background-color: #fff;
    border-radius: 50%;
`;

export const LabelText = styled.span`
    font-family: 'Lato';
    font-weight: 400;
    font-size: 14px;
    color: #171719;
`;