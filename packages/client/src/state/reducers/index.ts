import { combineReducers } from 'redux';
import alerstReducer from './alertsReducer';
import bundlesReducer from './bundlesReducer';
import cellsReducer from './cellsReducer';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
  alerts: alerstReducer,
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
