import { Dispatch } from 'react';
import bundlerHandler from '../../bundler';
import { ActionType } from '../action-types';
import {
  Action,
  AddProjectAction,
  DeleteCellAction,
  Direction,
  HideAlertAction,
  InsertCellAfterAction,
  MoveCellAction,
  ShowAlertAction,
  UpdateCellAction,
} from '../actions';
import { CellTypes } from '../cell';
import { ProjectState } from '../reducers/projectsReducer';

export const showAlert = (
  message: string,
  alertType: 'success' | 'error',
): ShowAlertAction => {
  return {
    type: ActionType.SHOW_ALERT,
    payload: { message, alertType, displayMode: 'inline-block' },
  };
};

export const hideAlert = (): HideAlertAction => {
  return {
    type: ActionType.HIDE_ALERT,
    payload: { displayMode: 'none' },
  };
};

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: { id, content },
  };
};
export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};
export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: { id, direction },
  };
};
export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes,
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type: cellType,
    },
  };
};

export const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.BUNDLE_START, payload: { cellId } });
    const result = await bundlerHandler(input);
    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: { cellId, bundle: { code: result.code, error: result.error } },
    });
  };
};

export const createProject = (project: ProjectState): AddProjectAction => {
  const { id, title, subtitle, description, userId } = project;
  return {
    type: ActionType.ADD_PROJECT,
    payload: { id, title, subtitle, description, userId },
  };
};
