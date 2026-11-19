import React, { Fragment, useState } from 'react';

import * as S from '../styles/drawer.style';
import * as G from '../../../styles/global.style';
import * as I from '../../../shared/styles/icon.style';

import { DrawerProps } from '../interfaces/drawerProps.interface';
import { LoadingState } from '../../loadingState/screens/LoadingState';

export const Drawer: React.FC<DrawerProps> = ({ isOpen, isSubmitting = false, formId, title, children, mode = "create", hideFooter = false, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    return (
        <Fragment>
            <S.DrawerOverlay $open={ isOpen && !isClosing }/>

            { isOpen && (
                <S.Drawer $open={ !isClosing } onAnimationEnd={ (event) => { if (event.currentTarget === event.target && isClosing) { onClose(); setIsClosing(false); } } }>
                    <S.Header>
                        <S.Title> { title } </S.Title>

                        <S.CloseButton type="button" onClick={ () => setIsClosing(true) }> <S.CloseButtonIcon/> </S.CloseButton>
                    </S.Header>

                    <S.Content> { children } </S.Content>

                    { !hideFooter && (
                        <S.Footer>
                            { isSubmitting && (
                                <LoadingState/>
                            ) }
                            { !isSubmitting && (
                                <G.ButtonsContainer>
                                    <S.FooterButton type="button" $variant="secondary" className="secondary" onClick={ () => setIsClosing(true) }>
                                        <I.BanIcon/>

                                        <S.FooterButtonText> Cancelar </S.FooterButtonText>
                                    </S.FooterButton>
                                    <S.FooterButton type="submit" $variant="primary" className="primary" form={ formId }>
                                        { mode === "create" ? <I.SaveIcon/> : mode === "edit"? <I.SquarePenIcon/> : <I.HardDriveUploadIcon/> }

                                        <S.FooterButtonText> { mode === "create" ? "Salvar" : mode === "edit" ? "Atualizar" : "Importar" } </S.FooterButtonText>
                                    </S.FooterButton>
                                </G.ButtonsContainer>
                            ) }
                        </S.Footer>
                    ) }
                </S.Drawer>
            ) }
        </Fragment>
    );
}
