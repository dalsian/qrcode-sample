import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import 'bootstrap/dist/css/bootstrap.css';
import App from './containers/App'

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const store = createStore(
  applyMiddleware(...middleware)
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
