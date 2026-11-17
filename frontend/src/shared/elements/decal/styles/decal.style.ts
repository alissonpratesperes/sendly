import styled from 'styled-components';

export const Decal = styled.div`
    height: 100px;
    width: 500px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    border-top-left-radius: 26px;
    border-top-right-radius: 26px;
    pointer-events: none;
    z-index: 0;
    background-color: #223463
`;
