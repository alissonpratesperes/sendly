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
    font-family: "Orbitron";
    font-weight: 900;
    font-size: 18px;
    color: #FFFFFF;
    background-color: #FF6B00;
    border-radius: 8px;
`;

export const PairingCodeCharactersSeparator = styled.span`
    margin: 0px 7.5px 0px 7.5px;
    font-size: 25px;
    font-weight: bold;
    color: #171719;
`;
