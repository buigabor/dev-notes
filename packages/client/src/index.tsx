import { css, Global } from '@emotion/react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { CellList } from './components/CellList';
import { NavBar } from './components/NavBar';
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
        <Router>
          <NavBar />
          <Switch>
            <Route path="/" exact component={CellList} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
          </Switch>
        </Router>
      </Provider>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
