import styled from 'styled-components';

export const Arrow = styled.div<{ 'data-type'?: string }>`
    height: 36px;
    width: 36px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    border-radius: 50%;
    color: #49454F;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer; 
    z-index: 3;

        &[data-type~="slick-prev"] {
            left: -15px;
        }

        &[data-type~="slick-next"] {
            right: -15px;
        }
`;

export const Card = styled.div`
    padding: 25px 25px 25px 25px;
    min-width: 0;
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
    border-radius: 25px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
`;

export const SliderWrapper = styled.div`
    height: 242px; 
    width: 100%;
    position: relative;
    overflow: visible; 

        .slick-dots {
            width: 100%;
            position: absolute;
            bottom: 10px;
            display: flex;
            justify-content: center;
            list-style: none;

            li {
                margin: 0px 4px 0px 4px;

                button {
                    height: 10px;
                    width: 10px;
                    border: none;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(8px);

                    &:before {
                        content: '';
                    }
                }

                    &.slick-active button {
                        background: rgba(255, 255, 255, 0.8);
                    }
            }
        }
`;

export const ImageWrapper = styled.div`
    height: 242px;
    width: 298px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    overflow: hidden;

        img {
            height: 100%;
            width: 100%;
            display: block;
            object-fit: cover;
            border-radius: inherit;
        }
`;

export const Info = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;

export const Date = styled.span`
    line-height: 24px;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 12px;
    color: #252B42;
`;

export const LabelRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justtify-content: flex-start;
    gap: 5px;
`;

export const BoldLabel = styled.p`
    line-height: 24px;
    font-family: 'Inter';
    font-weight: 700;
    font-size: 16px;
    color: #252B42;
`;

export const LightLabel = styled.p`
    line-height: 24px;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 16px;
    color: #252B42;
`;

export const ChainBadge = styled.div`
    padding: 1px 6px 1px 6px;
    height: 20px;
    line-height: 18px;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 12px;
    color: #FFFFFF;
    background-color: #FF734A;
    border-radius: 2px;
    display: inline-block;
`;