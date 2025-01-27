import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import App from './desktop/App'
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
// import store from './BLL/index';
import { isMobile } from 'react-device-detect'; // Импортируем функцию для определения устройства


import mobileStore from './mobile/BLL/index'
import desktopStore from './desktop/BLL/index'

const store = isMobile ? mobileStore : desktopStore;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={desktopStore}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);
