/**
 * Main Entry Point
 * Sets up providers and renders the app
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import { OnboardingProvider } from './context/OnboardingContext';
import './assets/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <OnboardingProvider>
          <App />
        </OnboardingProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);