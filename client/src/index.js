import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// css
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/css/index.css';

import DevTools from './components/DevTools';
import configureStore from './redux/store';
import TemplateContainer from './components/TemplateContainer';

const Store = configureStore();

const renderApp = (Component) => {
  render(
    <Provider store={Store}>
      <div>
        <Component/>
        <DevTools/>
      </div>
    </Provider>,
    document.getElementById('root')
  );
};

renderApp(TemplateContainer);
