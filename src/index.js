import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { setOptions } from 'react-scan';

if (process.env.NODE_ENV === 'development') {
  setOptions({
    trackAllComponents: true, // 모든 컴포넌트를 추적
    logToConsole: true,       // 콘솔에 로그 출력
  });
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
