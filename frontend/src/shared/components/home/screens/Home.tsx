import React from 'react';
import { Store, ClipboardList, CircleDollarSign, ChevronRight } from 'lucide-react';

import * as Styled from '../styles/Home.style';

const Home: React.FC = () => {
    const accessCards = [
        { icon: <Store size={20} />, title: "Gerenciar cadastros", description: "Regional, rede, lojas, produtos, tipo ação", path: "/registrations" },
        { icon: <ClipboardList size={20} />, title: "Ações comerciais", description: "Cadastre e visualize as ações", path: "/commercial-actions" },
        { icon: <CircleDollarSign size={20} />, title: "Financeiro", description: "Acompanhe seu faturamento", path: "/financial" }
    ];

    return (
        <>
            <Styled.PageWrapper>
                <Styled.Content>
                    {accessCards.map((card, index) => (
                        <Styled.Card to={card.path} key={index}>
                            <Styled.CardLeftContent>
                                <Styled.IconWrapper> {card.icon} </Styled.IconWrapper>

                                <Styled.Title> {card.title} </Styled.Title>

                                <Styled.Description> {card.description} </Styled.Description>
                            </Styled.CardLeftContent>

                            <Styled.CardRightContent> <ChevronRight size={20} /> </Styled.CardRightContent>
                        </Styled.Card>
                    ))}
                </Styled.Content>
            </Styled.PageWrapper>

            <Styled.Footer>
                <Styled.FooterLeftVector /> <Styled.FooterRightVector />
            </Styled.Footer>
        </>
    );
};

export default Home;