import 'app/config/dayjs.ts';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs.ts';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import AppRoutes from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
  return (
    <BrowserRouter basename={baseHref}>
      <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
