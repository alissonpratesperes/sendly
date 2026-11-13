import React, { Fragment } from 'react';
import { BarLoader, PropagateLoader } from 'react-spinners';

import * as Styled from '../styles/loadingState.style';
import { LoadingStateProps } from '../interfaces/loadingStateProps.interface';

export const LoadingState: React.FC<LoadingStateProps> = ({ isInBatchFlowScreens = false }) => {
  return (
    <Fragment>
      { isInBatchFlowScreens ? (
        <BarLoader width="100%" height={ 8 } color="#1C70E9" cssOverride={{ borderRadius: "16px", }}/>
      ) : (
        <Styled.LoadingStateContainer>
          <PropagateLoader size={ 25 } color="#1C70E9"/>
        </Styled.LoadingStateContainer>
      ) }
    </Fragment>
  );
}
