import { css, Global } from '@emotion/react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { CellList } from './components/CellList';
import { Home } from './components/Home';
import { NavBar } from './components/NavBar';
import { RoomServiceHome } from './components/RoomService/RoomServiceHome';
import { store } from './state';

const HomeContainer = () => (
  <div className="container">
    <Route path="/" component={Home} />
  </div>
);

const PlaygroundContainer = () => (
  <div className="container">
    <Route path="/" component={Home} />
  </div>
);

export const App = () => {
  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
            padding: 0;
            background: #1c2536;
          }
          ol,
          ul {
            list-style: none;
          }
        `}
      />

      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <>
              <NavBar />
              <Route path="/playground" exact component={CellList} />
              <Route path="/login" exact component={Login} />
              <Route path="/signup" exact component={SignUp} />
              <Route path="/room/:id" exact component={RoomServiceHome} />
            </>
          </Switch>
        </Router>
      </Provider>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
