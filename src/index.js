import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import './assets/main.css'
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux'

function dark(state = false, action) {
  switch (action.type) {
    case 'ISDARK':
      return true
    case 'ISLIGHT':
      return false
    default:
      return state
  }
}

const store = createStore(dark);

const render = () => ReactDOM.render(
  <React.StrictMode store={store}>
    <App
      dark={store.getState()}
      isDark={() => store.dispatch({ type: 'ISDARK' })}
      isLight={() => store.dispatch({ type: 'ISLIGHT' })}
    />
  </React.StrictMode>,
  document.getElementById('root')
);

render()
store.subscribe(render)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
