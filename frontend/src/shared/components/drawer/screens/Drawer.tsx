import React, { Fragment, useState } from 'react';
import { X, Ban, SquarePen, Save } from 'lucide-react';

import * as Styled from '../styles/drawer.style';
import { DrawerProps } from '../interfaces/drawerProps.interface';
import { LoadingState } from '../../loadingState/screens/LoadingState';

export const Drawer: React.FC<DrawerProps> = ({ isOpen, isSubmitting = false, formId, title, children, mode = "create", onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    return (
        <Fragment>
            <Styled.DrawerOverlay $open={ isOpen && !isClosing } onClick={ () => setIsClosing(true) } />

                { isOpen && (
                    <Styled.Drawer $open={ !isClosing } onAnimationEnd={ (event) => { if (event.animationName === "drawerClose") { onClose(); setIsClosing(false); } } }>
                        <Styled.Header>
                            <Styled.Title> { title } </Styled.Title>

                            <Styled.CloseButton type="button" onClick={ () => setIsClosing(true) }> <X size={ 25 } /> </Styled.CloseButton>
                        </Styled.Header>

                        <Styled.Content> { children } </Styled.Content>

                        <Styled.Footer>
                            { isSubmitting && (
                                <LoadingState/>
                            ) }
                            { !isSubmitting && (
                                <Fragment>
                                    <Styled.FooterButton type="button" $variant="secondary" className="secondary" onClick={ () => setIsClosing(true) }>
                                        <Ban size={ 25 } />

                                        <Styled.FooterButtonText> Cancelar </Styled.FooterButtonText>
                                    </Styled.FooterButton>
                                    <Styled.FooterButton type="submit" $variant="primary" className="primary" form={ formId }>
                                        { mode === "edit"? <SquarePen size={ 25 } /> : <Save size={ 25 } /> }

                                        <Styled.FooterButtonText> { mode === "edit" ? "Atualizar" : "Cadastrar" } </Styled.FooterButtonText>
                                    </Styled.FooterButton>
                                </Fragment>
                            ) }
                        </Styled.Footer>
                    </Styled.Drawer>
                ) }
        </Fragment>
    );
}
