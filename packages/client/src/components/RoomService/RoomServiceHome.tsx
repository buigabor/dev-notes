import { RoomServiceProvider } from '@roomservice/react';
import * as H from 'history';
import React from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { RoomService } from './RoomService';

export interface IReactRouterParams {
  id: string;
}
export interface RouteComponentProps<P> {
  match: match<P>;
  location: H.Location;
  history: H.History;
  staticContext?: any;
}

export interface match<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}

async function myAuthFunction(params: {
  room: string;
  ctx: { userID: number };
}) {
  console.log(params);

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

  if (response.status === 401) {
    throw new Error('Unauthorized!');
  }

  if (response.status !== 200) {
    throw await response.text();
  }

  const body = await response.json();
  console.log(body);
  return {
    user: body.user,
    resources: body.resources,
    token: body.token,
  };
}

export const RoomServiceHome: React.FC<
  RouteComponentProps<IReactRouterParams>
> = ({ match }) => {
  const user = useTypedSelector((state) => state.user);

  return (
    <RoomServiceProvider
      online={user.userId !== null}
      clientParameters={{
        auth: myAuthFunction,
        //  Passed into myAuthFunction when RoomService connects. Include
        //  anything you need here to identify the user on the server.
        ctx: {
          userID: user.userId,
        },
      }}
    >
      <div>
        <RoomService match={match} />
      </div>
    </RoomServiceProvider>
  );
};
