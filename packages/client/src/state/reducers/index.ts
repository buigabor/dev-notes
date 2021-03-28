import { combineReducers } from 'redux';
import alerstReducer from './alertsReducer';
import bundlesReducer from './bundlesReducer';
import cellsReducer from './cellsReducer';
import projectsReducer from './projectsReducer';
import userReducer from './userReducer';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
  alerts: alerstReducer,
  projects: projectsReducer,
  user: userReducer,
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
