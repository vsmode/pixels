import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { injectGlobal } from 'styled-components';
import fastclick from 'react-fastclick';
import reducer from './reducers';
import initKeyboard from './keyboard';
import createInitialState from './store/state';
import App from './components/App';

const store = createStore(
  reducer,
  createInitialState({
    width: 8,
    height: 8,
    frameCount: 8
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const init = () => {
  fastclick(); // make mobile safari responsive to touch events

  window.addEventListener('contextmenu', e => e.preventDefault());

  initKeyboard(store);

  injectGlobal`
  * {
    box-sizing: border-box;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-overflow-scrolling: touch;
    touch-action: manipulation;
  }
  html, body {
    position: fixed;
    overflow: hidden;
    height: 100vh;
    margin: 0;
    font-family: 'Source Sans Pro', Helvetica, sans-serif;
  }
  main {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
  }
  `;
};

const run = update => {
  store.subscribe(update);
  update();
};

/**
 * Let the pixel editing begin!
 */

init();

run(() => {
  render(
    <App {...store.getState()} dispatch={store.dispatch} />,
    document.getElementById('root')
  );
});

if (module.hot) module.hot.accept(run);
