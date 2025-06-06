import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { HelmetProvider } from 'react-helmet-async';
// import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}

export default App;