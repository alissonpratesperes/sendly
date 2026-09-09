import styled from 'styled-components';

export const Overlay = styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
    z-index: 1000;
`;

export const ModalWrapper = styled.div`
    padding: 20px 20px 20px 20px;
    min-height: 208px;
    width: 640px;
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    box-sizing: border-box;
`;

export const ModalContainer = styled.div`
    position: relative;
`;

export const ModalHeader = styled.div`
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const Title = styled.h3`
    font-family: 'Lato';
    font-weight: 700;
    font-size: 18px; 
    color: #171719;
`;

export const Divider = styled.hr`
    border: none;
    border-top: 1px solid #D3D2D9;
`;

export const ModalBody = styled.div`
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;.
    justify-content: center;
    row-gap: 10px;
`;

export const Text = styled.p`
    font-family: 'Lato';
    font-weight: 500;
    font-size: 16px; 
    color: #2F2E33;
`;

export const BoldText = styled.b`
    font-weight: 700;
`;

export const ModalFooter = styled.div`
    margin: 15px 0px 0px 0px; 
    height: 50px; 
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
    column-gap: 20px; 
`;

export const ButtonsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    column-gap: 16px;
`;

export const Button = styled.button`
    font-family: 'Lato';
    font-weight: 700;
    font-size: 16px; 
    color: #171719;
    border: none;
    outline: none;
    border-radius: 8px;
    cursor: pointer;
`;

export const CancelButton = styled(Button)`
    padding: 8px 16px 8px 16px;
    height: 40px;
    width: 94px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: transparent;
`;

export const DeleteButton = styled(Button)`
    padding: 8px 16px 8px 16px;
    height: 40px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    background-color: #B81933;
`;

export const CloseButton = styled.button`
    background: transparent;
    cursor: pointer;
    border: none;
`;