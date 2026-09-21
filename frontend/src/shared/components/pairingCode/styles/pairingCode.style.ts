import styled from 'styled-components';

export const PairingCodeContainer = styled.div`
    width: 100%;
`;

export const PairingCodeTextContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 15px;
`;

export const PairingCodeDigitsContainer = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 7.5px;
`;

export const PairingCodeCharactersCards = styled.span`
    height: 44px;
    width: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    color: #FFFFFF;
    background-color: #1C70E9;
    border-radius: 7px;
`;

export const PairingCodeCharactersSeparator = styled.span`
    font-size: 25px;
    font-weight: bold;
    color: #2F2E33;
`;
