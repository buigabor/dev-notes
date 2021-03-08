import { css, Global } from '@emotion/react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { CellList } from './components/CellList';
import { store } from './state';

export const App = () => {
  return (
    <>
      <Global
        styles={css`
          body {
            background: #1c2536;
            margin: 0;
            padding: 0;
          }
          ol,
          ul {
            list-style: none;
          }
        `}
      />
      <Provider store={store}>
        <div>
          <CellList />
        </div>
      </Provider>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
