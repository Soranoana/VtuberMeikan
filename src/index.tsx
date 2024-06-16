import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

var container = document.getElementById('root') as ReactDOM.Container;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
