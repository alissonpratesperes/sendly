import React from 'react';
import { X } from 'lucide-react';

import * as Styled from '../styles/GenericDrawer.style';
import { GenericDrawerProps } from '../interfaces/GenericDrawerProps.interface';

export const GenericDrawer: React.FC<GenericDrawerProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <>
            <Styled.DrawerOverlay $open={isOpen} onClick={onClose} />

            {isOpen && (
                <Styled.Drawer>
                    <Styled.Header>
                        <Styled.Title> {title} </Styled.Title>

                        <Styled.CloseButton onClick={onClose}> <X size={20} /> </Styled.CloseButton>
                    </Styled.Header>

                    <Styled.Content> {children} </Styled.Content>
                </Styled.Drawer>
            )}
        </>
    );
};