import styled from 'styled-components';

export const BrandContainer = styled.div<{ $isFooter?: boolean; }>`
    padding: 0px 20px 10px 20px;
    height: 100px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #F0F0F5;
    border-bottom-left-radius: 26px;
    border-bottom-right-radius: 26px;

        &::before, &::after {
            content: "";
            position: absolute;
            top: 0;
            height: 14px;
            width: 14px;
            pointer-events: none;
        }
        &::before {
            left: -14px;
            border-radius: 0px 26px 0px 0px;
            box-shadow: 5px -5px 0 5px #F0F0F5;
        }
        &::after {
            right: -14px;
            border-radius: 26px 0px 0px 0px;
            box-shadow: -5px -5px 0 5px #F0F0F5;
        }
`;

export const BrandLogotype = styled.p<{ $isFooter?: boolean; }>`
    font-family: "Alien Block";
    font-weight: 400;
    font-size: 70px;
    color: #9CA3AF;
`;
