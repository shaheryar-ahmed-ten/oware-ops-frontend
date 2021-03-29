import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { getUserToken } from './utils/common';
import { useNavigate } from "react-router-dom";

axios.interceptors.request.use(request => {
  const token = getUserToken();
  if (token) {
    request.headers['authorization'] = `Bearer ${token}`
  } else delete request.headers['authorization'];
  return request;
}, error => Promise.reject(error));

axios.interceptors.response.use(undefined, error => {
  if (error.response.status == 401) {
    // if (window.location.href.split('/').pop() != 'login') navigate('/login');
  }
  return Promise.reject(error)
});

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
