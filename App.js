import React from 'react';
import App1 from './App1';

import { Provider } from 'react-redux';
import store from './store/store';



export default function App(props) {
  return (
    <Provider store={store()}>
      <App1 props={props} />
    </Provider>
  );
}