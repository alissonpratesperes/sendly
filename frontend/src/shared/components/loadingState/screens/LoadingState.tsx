import React, { Fragment } from 'react';

import * as S from '../styles/loadingState.style';

import { LoadingStateProps } from '../interfaces/loadingStateProps.interface';

export const LoadingState: React.FC<LoadingStateProps> = ({ isInBatchFlowScreens = false }) => {
  return (
    <Fragment>
      { isInBatchFlowScreens ? (
        <S.LoadingStateBar />
      ) : (
        <S.LoadingStateContainer> <S.LoadingStateSpinner /> </S.LoadingStateContainer>
      ) }
    </Fragment>
  );
}
