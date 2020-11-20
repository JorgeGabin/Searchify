import React from 'react';
import ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl';

import './App.css';
import { App } from './modules/app';
import reportWebVitals from './reportWebVitals';
import {initReactIntl} from './i18n';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

// import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css';
// import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';

import * as serviceWorker from './serviceWorker';
import backend from './backend';
import { NetworkError } from './backend';

// backend.init(error => store.dispatch(app.actions.error(new NetworkError())));
const {locale, messages} = initReactIntl();
ReactDOM.render(
    <IntlProvider locale={locale} messages={messages}>
        <App />
    </IntlProvider>
  ,document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
