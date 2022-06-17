import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fontsource/poppins';
import '@fontsource/poppins/700.css';
import '@fontsource/open-sans';
import '@fontsource/open-sans/700.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
