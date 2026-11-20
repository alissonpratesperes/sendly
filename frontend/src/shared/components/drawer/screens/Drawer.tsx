import React, { Fragment, useState } from 'react';

import * as S from '../styles/drawer.style';
import * as I from '../../../styles/icon.style';
import * as G from '../../../styles/global.style';

import { DrawerProps } from '../interfaces/drawerProps.interface';
import { LoadingState } from '../../loadingState/screens/LoadingState';

export const Drawer: React.FC<DrawerProps> = ({ isOpen, isSubmitting = false, formId, title, children, mode = "create", viewOrImportMode = false, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    return (
        <Fragment>
            <S.DrawerOverlay $open={ isOpen && !isClosing }/>

            { isOpen && (
                <S.Drawer $open={ !isClosing } onAnimationEnd={ (event) => { if (event.currentTarget === event.target && isClosing) { onClose(); setIsClosing(false); } } }>
                    <S.Header>
                        <S.Title> { title } </S.Title>

                        <S.CloseButton type="button" onClick={ () => setIsClosing(true) }> <I.XIcon/> </S.CloseButton>
                    </S.Header>

                    <S.Content> { children } </S.Content>

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

                                { !viewOrImportMode && (
                                    <S.FooterButton type="submit" $variant="primary" className="primary" form={ formId }>
                                        { mode === "create" ? <I.SaveIcon/> : mode === "edit"? <I.SquarePenIcon/> : <I.HardDriveUploadIcon/> }

                                        <S.FooterButtonText> { mode === "create" ? "Salvar" : mode === "edit" ? "Atualizar" : "Importar" } </S.FooterButtonText>
                                    </S.FooterButton>
                                ) }
                            </G.ButtonsContainer>
                        ) }
                    </S.Footer>
                </S.Drawer>
            ) }
        </Fragment>
    );
}
