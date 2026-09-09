import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

import { AppRouting } from './AppRouting';
import { GlobalStyle } from './shared/styles/Global.style';
import { LoadingProvider } from './shared/components/loading/contexts/LoadingContext.context';

function App() {
  return (
    <LoadingProvider>
      <GlobalStyle />

      <div className="App">
        <BrowserRouter> <AppRouting /> </BrowserRouter>
      </div>

      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnHover draggable theme="colored" />
    </LoadingProvider>
  );
};

export default App;
