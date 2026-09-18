import styled from 'styled-components';

export const SearchInputWrapper = styled.div`
    margin-bottom: 30px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 30px;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
`;

export const SearchInputContainer = styled.div`
    padding: 0px 15px;
    height: auto;
    width: 100%;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    border-radius: 14px;
    background-color: #FFFFFF;

        &::before {
            content: "";
            position: absolute;
            inset: -6px;
            border-radius: 18px;
            border: 2px solid #223463;
            opacity: 0;
            transform: scale(1.08);
            transition: transform 0.3s ease, opacity 0.3s ease;
            pointer-events: none;
        }
        &:focus-within::before {
            opacity: 1;
            transform: scale(1);
        }
`;

export const SearchInputField = styled.input`
    margin-left: 15px;
    height: 55px;
    width: 100%;
    font-family: "Lato";
    font-weight: 400;
    font-size: 16px;
    color: #212121;
    border: none;
    outline: none;
    background-color: #FFFFFF;
    border-radius: 14px;
    z-index: 1;

        &::placeholder {
            color: #BDBDBD;
        }
`;

export const AddButton = styled.button`
    padding: 15px;
    height: auto;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Lato";
    font-weight: 700;
    font-size: 16px;
    color: #238636;
    border: none;
    outline: none;
    border-radius: 14px;
    background-color: transparent;
    cursor: pointer;
    transition: color 0.3s ease, background-color 0.3s ease;

        &:hover {
            color: #FFFFFF;
            background-color: #238636;
            animation: addButtonEffect 0.6s ease-in-out;
        }

            svg {
                stroke: currentColor;
            }

                @keyframes addButtonEffect {
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

export const SearchInputSubmitText = styled.span`
    margin-left: 7.5px;
`;
