import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface AlertState {
  message: string;
  displayMode: 'inline-block' | 'none';
  alertType: 'success' | 'error' | '';
}

const initialState: AlertState = {
  message: '',
  displayMode: 'none',
  alertType: '',
};

const alerstReducer = produce(
  (state: AlertState = initialState, action: Action): AlertState => {
    switch (action.type) {
      case ActionType.SHOW_ALERT:
        state.message = action.payload.message;
        state.displayMode = 'inline-block';
        state.alertType = action.payload.alertType;
        return state;
      case ActionType.HIDE_ALERT:
        state.displayMode = 'none';
        return state;
      default:
        return state;
    }
  },
);

export default alerstReducer;
