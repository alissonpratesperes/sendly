import styled from 'styled-components';

export const Overlay = styled.div<{ $open: boolean }>`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(7px);
    z-index: 1000;
    transition: opacity 0.6s ease-in-out, visibility 0.6s ease-in-out;

    opacity: ${ ({ $open }) => ($open ? 1 : 0) };
    visibility: ${ ({ $open }) => ($open ? "visible" : "hidden") };
`;

export const ModalWrapper = styled.div<{ $open: boolean }>`
    min-height: 208px;
    width: auto;
    background-color: #F0F0F5;
    border-radius: 14px;
    box-sizing: border-box;

    animation: ${ ({ $open }) => $open ? "modalOpen 0.6s ease-in-out forwards" : "modalClose 0.6s ease-in-out forwards" };

        @keyframes modalOpen {
            0% {
                transform: translateY(100px) scale(0.9);
            }

            70% {
                transform: translateY(-10px) scale(1.02);
            }

            100% {
                transform: translateY(0) scale(1);
            }
        }
        @keyframes modalClose {
            0% {
                transform: translateY(0) scale(1);
            }

            30% {
                transform: translateY(-10px) scale(1.02);
            }

            100% {
                transform: translateY(100px) scale(0.9);
            }
        }
`;

export const ModalContainer = styled.div`
    position: relative;
`;

export const ModalHeader = styled.div`
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #E9EAEB;
`;

export const Title = styled.h3`
    font-family: "Inter";
    font-weight: 700;
    font-size: 18px;
    color: #171719;
`;

export const CloseButton = styled.button`
    height: 55px;
    width: 55px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: none;
    color: #224463;
    background: none;
    border-radius: 14px;
    cursor: pointer;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #FFFFFF;
            background-color: #223463;
            animation: closeButtonEffect 0.6s ease-in-out;
        }

            svg {
                stroke: currentColor;
            }

                @keyframes closeButtonEffect {
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

export const ModalBody = styled.div`
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;.
    justify-content: center;
    row-gap: 10px;
`;

export const Text = styled.p`
    font-family: "Inter";
    font-weight: 500;
    font-size: 16px;
    color: #2F2E33;
`;

export const BoldText = styled.b`
    font-weight: 700;
`;

export const ModalFooter = styled.div`
    margin-top: auto;
    padding: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    column-gap: 30px;
    border-top: 2px solid #E9EAEB;
`;

export const FooterButtonText = styled.span`
    margin-left: 7.5px;
`;

export const Button = styled.button`
    padding: 15px;
    height: 55px;
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
    border: none;
    border-radius: 14px;
    cursor: pointer;
`;

export const CancelButton = styled(Button)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    color: #223463;
    background: transparent;
    transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover {
            font-weight: 700;
            color: #FFFFFF;
            background-color: #223463;
            animation: footerButtonEffect 0.6s ease-in-out;
        }

            svg {
                stroke: currentColor;
            }

                @keyframes footerButtonEffect {
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

export const DeleteButton = styled(Button)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    color: #DC143C;
    background: transparent;transition: font-weight 0.3s ease, color 0.3s ease, background-color 0.3s ease;

        &:hover {
            font-weight: 700;
            color: #FFFFFF;
            background-color: #DC143C;
            animation: footerButtonEffect 0.6s ease-in-out;
        }

            svg {
                stroke: currentColor;
            }

                @keyframes footerButtonEffect {
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