import styled from 'styled-components';
import { ArrowBigLeft, ArrowBigRight, Ellipsis } from 'lucide-react';

export const PaginateContainer = styled.div`
    height: auto;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: transparent;
`;

export const PaginateButton = styled.button`
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 500;
    font-size: 16px;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 14px;
    color: #171719;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover:not(:disabled) {
            font-weight: 700;
            color: #FFFFFF;
            background-color: #171719;
            animation: paginateButtonEffect 0.6s ease-in-out;
        }
        &:disabled {
            color: #E6E7EC;
            cursor: not-allowed;
            opacity: 0.5;
        }

            svg {
                stroke: currentColor;
            }

                @keyframes paginateButtonEffect {
                    0% {
                        transform: scale(1.08);
                    }

                    50% {
                        transform: scale(0.95);
                    }

                    100% {
                        transform: scale(1);
                    }
                }
`;

export const PreviousButtonText = styled.span`
    display: flex;
    align-items: center;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
`;

export const ArrowLeftIcon = styled(ArrowBigLeft)`
    margin-right: 7.5px;
`;

export const PagesArrayContainer = styled.div`
    height: auto;
    width: auto;
    display: flex;
    align-items: center;
    gap: 7.5px;
`;

export const EllipsisIcon = styled(Ellipsis)`
    margin-left: 30px;
    margin-right: 30px;
    height: 25px;
    width: 25px;

    color: "#E6E7EC";
`;

export const PageButton = styled.button<{ $active?: boolean }>`
    padding: 15px;
    height: 55px;
    width: 55px;
    font-family: "Lato";
    font-weight: 500;
    font-size: 16px;
    border-radius: 14px;
    border: none;
    outline: none;
    cursor: pointer;
    opacity: 1;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

    font-weight: ${ ({ $active }) => ($active ? 700 : 500) };
    cursor: ${ ({ $active }) => ($active ? "default" : "pointer") };
    color: ${ ({ $active }) => ($active ? "#FFFFFF" : "#171719") };
    background: ${ ({ $active }) => ($active ? "#171719" : "transparent") };

        &:hover {
            font-weight: 700;
            color: #FFFFFF;
            background-color: #171719;
            animation: paginateButtonEffect 0.6s ease-in-out;
        }

            svg {
                stroke: currentColor;
            }

                @keyframes paginateButtonEffect {
                    0% {
                        transform: scale(1.08);
                    }

                    50% {
                        transform: scale(0.95);
                    }

                    100% {
                        transform: scale(1);
                    }
                }
`;

export const NextButtonText = styled.span`
    display: flex;
    align-items: center;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
`;

export const ArrowRightIcon = styled(ArrowBigRight)`
    margin-left: 7.5px;
`;
