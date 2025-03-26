// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa desde 'react-dom/client'
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // Crea una raíz
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
