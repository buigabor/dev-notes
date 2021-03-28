import { css, Global } from '@emotion/react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { CellList } from './components/CellList';
import { NavBar } from './components/NavBar';
import { RoomServiceHome } from './components/RoomService/RoomServiceHome';
import { store } from './state';

export const App = () => {
  function useUserID(): string | null {
    const [userID, setUserID] = useState<string | null>(null);

    //  useEffect forces this to happen on the client, since `window` is not
    //  available on the server during server-side rendering
    useEffect(() => {
      let userID = window.localStorage.getItem('roomservice-user');
      if (userID == null) {
        userID = String(Math.random());
        window.localStorage.setItem('roomservice-user', userID);
      }
      setUserID(userID);
    }, []);

    return userID;
  }
  const userID = useUserID();

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
            <Route path="/room/:id" component={RoomServiceHome} />
          </Switch>
        </Router>
      </Provider>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
