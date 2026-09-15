import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

import { AppRouting } from './AppRouting';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalStyle } from './shared/styles/Global.style';

function App() {
  return (
    <Fragment>
      <GlobalStyle />

      <div className="App">
        <BrowserRouter>
          <AppRouting />
        </BrowserRouter>
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

export default App;
