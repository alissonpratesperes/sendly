import { Fragment } from 'react/jsx-runtime';
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
        <BrowserRouter> <AppRouting /> </BrowserRouter>
      </div>

      <ToastContainer position="top-center" autoClose={ 5000 } hideProgressBar={ false } newestOnTop={ true } closeOnClick pauseOnHover draggable theme="colored" />
    </Fragment>
  );
};

export default App;
