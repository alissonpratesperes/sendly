import React from 'react';
import Slider from 'react-slick';
import { format } from 'date-fns';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import * as Styled from '../styles/Card.style';
import { CardProps } from '../interfaces/CardProps.interface';

const PrevArrow = (props: any) => { return (<Styled.Arrow onClick={props.onClick} data-type="slick-prev"> <ChevronLeft size={24} /> </Styled.Arrow>); };
const NextArrow = (props: any) => { return (<Styled.Arrow onClick={props.onClick} data-type="slick-next">  <ChevronRight size={24} /> </Styled.Arrow>); };

const Card: React.FC<CardProps> = ({ id, images, date, ta, product, location, chain }) => {
    const navigate = useNavigate();

    return (
        <Styled.Card>
            <Styled.SliderWrapper>
                <Slider fade={true} dots={true} arrows={true} infinite={true} slidesToShow={1} slidesToScroll={1} prevArrow={<PrevArrow />} nextArrow={<NextArrow />}>
                    {images.map((image, index) => (<Styled.ImageWrapper key={index}> <img src={image} alt={`Imagem ${index + 1}`} /> </Styled.ImageWrapper>))}
                </Slider>
            </Styled.SliderWrapper>

            <Styled.Info onClick={() => navigate(`/commercial-actions/${id}`)}>
                <Styled.Date> {format(date, 'dd/MM/yyyy')} </Styled.Date>

                {ta && <Styled.LabelRow> <Styled.BoldLabel> TA: </Styled.BoldLabel> {ta} </Styled.LabelRow>}
                {product && <Styled.LabelRow> <Styled.BoldLabel> Produto: </Styled.BoldLabel> {product} </Styled.LabelRow>}
                {location && <Styled.LabelRow> <Styled.BoldLabel> Local: </Styled.BoldLabel> {location} </Styled.LabelRow>}

                {chain && <Styled.ChainBadge> {chain} </Styled.ChainBadge>}
            </Styled.Info>
        </Styled.Card>
    );
};

export default Card;