import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { ReactComponent as FooterIllustration } from '../../../../assets/footer_illustration.svg';

export const PageWrapper = styled.div`
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-x: hidden;
`;

export const Content = styled.div`
    width: 664px;
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 30px;
    column-gap: 40px;

        & > a:nth-child(3) {
            grid-column: 1 / 3;
            justify-self: center;
        }
`;

export const Card = styled(Link)`
    height: 152px;
    width: 312px;
    padding: 15px 23px 15px 23px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #FFFFFF;
    border: 1px solid #D3D2D9;
    border-radius: 8px;
`;

export const CardLeftContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
`;

export const CardRightContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8E8E8E;
`;

export const IconWrapper = styled.div`
    height: 53px;
    width: 53px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #00355D;
    border-radius: 8px;
    color: #FFFFFF;
`;

export const Title = styled.h3`
    font-family: 'Inter';
    font-weight: 700;
    font-size: 16px;
    color: #171719;
`;

export const Description = styled.span`
    font-family: 'Inter';
    font-weight: 400;
    font-size: 12px;
    color: #171719;
`;

export const Footer = styled.footer`
    margin-top: auto;
    width: calc(100vw - (100vw - 100%));
    display: flex;
    flex-direction: row;
    align-items: center;
    jutify-content:center;
    flex-shrink: 0;
    overflow: hidden;
`;

export const FooterLeftVector = styled(FooterIllustration)`
    height: auto;
    min-width: 0;
    flex: 1;
    object-fit: cover;
    transform: scaleX(-1);
`;

export const FooterRightVector = styled(FooterIllustration)` 
    height: auto;
    min-width: 0;
    flex: 1;
    object-fit: cover;
`;