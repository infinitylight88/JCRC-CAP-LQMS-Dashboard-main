import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// LabQMS browser entry point.
// Flow: index.html provides #root -> this file starts React -> App renders the
// dashboard routes/views.  Components request `/api/...`; Vite forwards that
// prefix to the FastAPI service (see vite.config.js) during local development.
// StrictMode intentionally re-renders development components to surface unsafe
// side effects before the application is deployed.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
