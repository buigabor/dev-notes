import { css, Global } from '@emotion/react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { RoomServiceProvider } from '@roomservice/react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { CellList } from './components/CellList';
import { NavBar } from './components/NavBar';
import { store } from './state';

async function myAuthFunction(params: {
  room: string;
  ctx: { userID: number };
}) {
  const response = await fetch('http://localhost:4005/roomservice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    //  Pass cookies to server
    credentials: 'include',
    body: JSON.stringify({
      room: params.room,

      //  TODO: Determine userID on server based on cookies or values passed in here.
      user: params.ctx.userID,
    }),
  });
  console.log(response);

  if (response.status === 401) {
    throw new Error('Unauthorized!');
  }

  if (response.status !== 200) {
    throw await response.text();
  }

  const body = await response.json();

  return {
    user: body.user,
    resources: body.resources,
    token: body.token,
  };
}

// const service = new RoomService({
//   auth: async (params) => {
//     const response = await fetch('http://localhost:8080/api/roomservice', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//       body: JSON.stringify({
//         room: params.room,
//       }),
//     });
//     if (response.status === 401) {
//       throw new Error('Unauthorized!');
//     }
//     const body = await response.json();
//     return {
//       user: body.user,
//       resources: body.resources,
//       token: body.token,
//     };
//   },
// });

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

      <RoomServiceProvider
        online={userID !== null}
        clientParameters={{
          auth: myAuthFunction,
          //  Passed into myAuthFunction when RoomService connects. Include
          //  anything you need here to identify the user on the server.
          ctx: {
            userID,
          },
        }}
      >
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
      </RoomServiceProvider>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
