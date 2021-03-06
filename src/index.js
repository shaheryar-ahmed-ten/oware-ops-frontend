import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { getToken } from './utils/common';

axios.interceptors.request.use(request => {
  const token = getToken();
  console.log('TOKEN', token)
  if (token) {
    request.headers['authorization'] = `Bearer ${token}`
  }
  delete request.headers['authorization'];
  return request;
}, error => Promise.reject(error));

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
