import React, { Fragment, useState } from 'react';
import { X, Ban, Pencil, Save } from 'lucide-react';

import * as Styled from '../styles/genericDrawer.style';
import { GenericDrawerProps } from '../interfaces/genericDrawerProps.interface';

export const GenericDrawer: React.FC<GenericDrawerProps> = ({ isOpen, onClose, title, children, mode = "create", formId }) => {
    const [isClosing, setIsClosing] = useState(false);

    return (
        <Fragment>
            <Styled.DrawerOverlay $open={ isOpen && !isClosing } onClick={ () => setIsClosing(true) } />

                { isOpen && (
                    <Styled.GenericDrawer $open={ !isClosing } onAnimationEnd={ (event) => { if (event.animationName === "drawerClose") { onClose(); setIsClosing(false); } } }>
                        <Styled.Header>
                            <Styled.Title> { title } </Styled.Title>

                            <Styled.CloseButton type="button" onClick={ () => setIsClosing(true) }> <X size={ 25 } /> </Styled.CloseButton>
                        </Styled.Header>

                        <Styled.Content> { children } </Styled.Content>

                        <Styled.Footer>
                            <Styled.FooterButton type="button" $variant="secondary" className="secondary" onClick={ () => setIsClosing(true) }>
                                <Ban size={ 25 } />

                                <Styled.FooterButtonText> Cancelar </Styled.FooterButtonText>
                            </Styled.FooterButton>
                            <Styled.FooterButton type="submit" $variant="primary" className="primary" form={ formId }>
                                { mode === "edit"? <Pencil size={ 25 } /> : <Save size={ 25 } /> }

                                <Styled.FooterButtonText> { mode === "edit" ? "Atualizar" : "Cadastrar" } </Styled.FooterButtonText>
                            </Styled.FooterButton>
                        </Styled.Footer>
                    </Styled.GenericDrawer>
                ) }
        </Fragment>
    );
}
