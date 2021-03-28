import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface UserState {
  username: string | null;
  userId: number | null;
}

const initialState: UserState = {
  username: null,
  userId: null,
};

const userReducer = produce(
  (state: UserState = initialState, action: Action): UserState => {
    switch (action.type) {
      case ActionType.SET_USER:
        state.username = action.payload.username;
        state.userId = action.payload.userId;
        return state;
      default:
        return state;
    }
  },
);

export default userReducer;
