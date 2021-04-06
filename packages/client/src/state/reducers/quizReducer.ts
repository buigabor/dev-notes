import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Quiz } from '../quiz';

export interface QuizState {
  id:number | null;
  userId: number | null;
  quizSet: Quiz[]
  quizTitle:string | null;
}

const initialState: QuizState = {
  id:null,
  userId:null,
  quizSet: [],
  quizTitle: null,
};

const quizReducer = produce(
  (state: QuizState = initialState, action: Action): QuizState => {
    switch (action.type) {
      case ActionType.LOAD_QUIZ:
      state.id = action.payload.id;
      state.quizTitle = action.payload.quizTitle;
      state.userId = action.payload.userId;
      state.quizSet = action.payload.quizSet;
        return state;
      default:
        return state;
    }
  },
);

export default quizReducer;
