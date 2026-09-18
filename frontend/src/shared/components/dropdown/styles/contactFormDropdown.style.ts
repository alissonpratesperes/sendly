import styled from 'styled-components';

export const OptionContent = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
`;

export const ListColor = styled.span<{ $color: string }>`
    width: 25px;
    height: 25px;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: ${ ({ $color }) => $color };
`;

export const CountryFlag = styled.span`
    font-size: 25px;
`;
