import React, { Fragment } from 'react';

import * as Styled from '../styles/loadingState.style';
import { LoadingStateProps } from '../interfaces/loadingStateProps.interface';

export const LoadingState: React.FC<LoadingStateProps> = ({ isInBatchFlowScreens = false }) => {
  return (
    <Fragment>
      { isInBatchFlowScreens ? (
        <Styled.LoadingStateBar />
      ) : (
        <Styled.LoadingStateContainer> <Styled.LoadingStateSpinner /> </Styled.LoadingStateContainer>
      ) }
    </Fragment>
  );
}
