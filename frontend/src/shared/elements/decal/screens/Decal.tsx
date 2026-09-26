import React from 'react';

import * as Styled from '../styles/decal.style';
import { Copyright } from '../../copyright/screens/Copyright';

export const Decal: React.FC = () => {
    return (
        <Styled.Decal>
            <Copyright/>
        </Styled.Decal>
    );
}
