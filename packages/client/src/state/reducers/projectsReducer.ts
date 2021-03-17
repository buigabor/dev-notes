import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface Project {
  userId: number | null;
  id: number | null;
  title: string;
  subtitle: string;
  description: string;
}

export interface ProjectState {
  id: number | null;
  title: string;
  subtitle: string;
  description: string;
  userId: number | null;
}

const initialState: ProjectState = {
  id: null,
  title: '',
  subtitle: '',
  description: '',
  userId: null,
};

const projectsReducer = produce(
  (state: ProjectState = initialState, action: Action): ProjectState => {
    switch (action.type) {
      case ActionType.ADD_PROJECT:
        state.id = action.payload.id;
        state.userId = action.payload.userId;
        state.title = action.payload.title;
        state.subtitle = action.payload.subtitle;
        state.description = action.payload.description;
        return state;
      case ActionType.EDIT_PROJECT:
        state.title = action.payload.title;
        state.subtitle = action.payload.subtitle;
        state.description = action.payload.description;
        return state;
      case ActionType.LOAD_PROJECT:
        state.id = action.payload.id;
        state.title = action.payload.title;
        state.subtitle = action.payload.subtitle;
        state.description = action.payload.description;
        return state;
      case ActionType.SAVE_PROJECT:
        return state;
      default:
        return state;
    }
  },
);

export default projectsReducer;
