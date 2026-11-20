import { Fragment } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

import { AppRouting } from './AppRouting';
import { GlobalStyle } from './shared/styles/global.style';

export function App() {
  return (
    <Fragment>
      <GlobalStyle/>

        <div className="App">
          <BrowserRouter> <AppRouting/> </BrowserRouter>
        </div>

          <ToastContainer
            hideProgressBar={ false }
            position="bottom-left"
            newestOnTop={ true }
            autoClose={ 5000 }
            theme="colored"
            closeOnClick
            pauseOnHover
            draggable
          />
    </Fragment>
  );
}
