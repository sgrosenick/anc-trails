import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import reducer from './reducers'
import './index.scss';
import { ThemeProvider } from "@material-ui/core/styles";
import trailsTheme from './style/trailsTheme';
import App from './App';
import * as serviceWorker from './serviceWorker';
require('dotenv').config();

const middleware = [thunk];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
) 

ReactDOM.render(
  <Provider store={store}>
    {' '}
    <ThemeProvider theme={trailsTheme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
