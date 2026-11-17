import React, { Fragment, useState } from 'react';

import * as Styled from '../styles/drawer.style';
import { DrawerProps } from '../interfaces/drawerProps.interface';
import { LoadingState } from '../../loadingState/screens/LoadingState';

export const Drawer: React.FC<DrawerProps> = ({ isOpen, isSubmitting = false, formId, title, children, mode = "create", hideFooter = false, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    return (
        <Fragment>
            <Styled.DrawerOverlay $open={ isOpen && !isClosing }/>

            { isOpen && (
                <Styled.Drawer $open={ !isClosing } onAnimationEnd={ (event) => { if (event.currentTarget === event.target && isClosing) { onClose(); setIsClosing(false); } } }>
                    <Styled.Header>
                        <Styled.Title> { title } </Styled.Title>

                        <Styled.CloseButton type="button" onClick={ () => setIsClosing(true) }> <Styled.CloseButtonIcon/> </Styled.CloseButton>
                    </Styled.Header>

                    <Styled.Content> { children } </Styled.Content>

                    { !hideFooter && (
                        <Styled.Footer>
                            { isSubmitting && (
                                <LoadingState/>
                            ) }
                            { !isSubmitting && (
                                <Fragment>
                                    <Styled.FooterButton type="button" $variant="secondary" className="secondary" onClick={ () => setIsClosing(true) }>
                                        <Styled.FooterButtonCancelIcon/>

                                        <Styled.FooterButtonText> Cancelar </Styled.FooterButtonText>
                                    </Styled.FooterButton>
                                    <Styled.FooterButton type="submit" $variant="primary" className="primary" form={ formId }>
                                        { mode === "create" ? <Styled.FooterButtonSaveIcon/> : mode === "edit"? <Styled.FooterButtonEditIcon/> : <Styled.FooterButtonUploadIcon/> }

                                        <Styled.FooterButtonText> { mode === "create" ? "Salvar" : mode === "edit" ? "Atualizar" : "Importar" } </Styled.FooterButtonText>
                                    </Styled.FooterButton>
                                </Fragment>
                            ) }
                        </Styled.Footer>
                    ) }
                </Styled.Drawer>
            ) }
        </Fragment>
    );
}
