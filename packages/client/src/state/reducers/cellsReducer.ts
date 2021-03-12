import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: { [key: string]: Cell };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellsReducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.UPDATE_CELL: {
        const { id, content } = action.payload;
        state.data[id].content = content;
        return state;
      }
      case ActionType.DELETE_CELL: {
        state.order = state.order.filter((id) => {
          return id !== action.payload;
        });
        delete state.data[action.payload];
        return state;
      }
      case ActionType.MOVE_CELL: {
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // if target index is out of bound
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }

        // Swap the cells
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;

        return state;
      }
      case ActionType.INSERT_CELL_AFTER: {
        const cell: Cell = {
          id: randomId(),
          type: action.payload.type,
          content: '',
        };

        state.data[cell.id] = cell;

        const index = state.order.findIndex((id) => id === action.payload.id);
        if (index < 0) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(index + 1, 0, cell.id);
        }
        return state;
      }
      default:
        return state;
    }
  },
);

const randomId = () => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substr(2, 7);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};

export default cellsReducer;
