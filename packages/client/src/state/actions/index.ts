import { ActionType } from '../action-types';
import { Cell, CellTypes } from '../cell';
import { Quiz } from '../quiz';

export type Direction = 'up' | 'down';

export interface LoadCellsAction {
  type: ActionType.LOAD_CELLS;
  payload: {
    order: string[];
    data: { [key: string]: Cell };
  };
}
export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Direction;
  };
}
export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}
export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: { id: string; content: string };
}
export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: { id: string | null; type: CellTypes };
}

export interface BundleStartAction {
  type: ActionType.BUNDLE_START;
  payload: { cellId: string };
}

export interface BundleCompleteAction {
  type: ActionType.BUNDLE_COMPLETE;
  payload: { cellId: string; bundle: { code: string; error: string } };
}
export interface ShowAlertAction {
  type: ActionType.SHOW_ALERT;
  payload: {
    message: string;
    alertType: 'success' | 'error';
    displayMode: 'inline-block';
  };
}
export interface HideAlertAction {
  type: ActionType.HIDE_ALERT;
  payload: {
    displayMode: 'none';
  };
}

export interface AddProjectAction {
  type: ActionType.ADD_PROJECT;
  payload: {
    id: number | null;
    userId: number | null;
    title: string;
    subtitle: string;
    description: string;
  };
}

export interface EditProjectAction {
  type: ActionType.EDIT_PROJECT;
  payload: {
    title: string;
    subtitle: string;
    description: string;
  };
}

export interface LoadProjectAction {
  type: ActionType.LOAD_PROJECT;
  payload: {
    id: number | null;
    title: string;
    subtitle: string;
    description: string;
    userId: number | null;
  };
}
export interface SaveProjectAction {
  type: ActionType.SAVE_PROJECT;
  payload: {
    projectId: number;
    cells: Cell[];
  };
}

export interface SetUserAction {
  type: ActionType.SET_USER;
  payload: { username: string | null; userId: number | null };
}

export interface SetQuizAction{
  type:ActionType.SET_QUIZ;
  payload:{
    userId:number;
    quizSet: Quiz[]
  }
}

export type Action =
  | LoadCellsAction
  | MoveCellAction
  | DeleteCellAction
  | UpdateCellAction
  | InsertCellAfterAction
  | BundleStartAction
  | BundleCompleteAction
  | ShowAlertAction
  | HideAlertAction
  | AddProjectAction
  | EditProjectAction
  | LoadProjectAction
  | SaveProjectAction
  | SetUserAction
  | SetQuizAction;
