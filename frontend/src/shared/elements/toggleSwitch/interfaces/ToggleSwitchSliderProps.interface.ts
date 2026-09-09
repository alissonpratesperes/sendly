export interface ToggleSwitchSliderProps {
    label: string;
    checked: boolean;

    onChange: (changeEvent: React.ChangeEvent<HTMLInputElement>) => void;
};