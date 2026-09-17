import React from 'react';
import { PropagateLoader } from 'react-spinners';

import * as Styled from '../styles/loadingState.style';

export const LoadingState: React.FC = () => {
  return (
    <Styled.LoadingStateContainer>
      <PropagateLoader size={ 25 } color="#1C70E9" />
    </Styled.LoadingStateContainer>
  );
}
