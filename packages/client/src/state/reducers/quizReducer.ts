import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Quiz } from '../quiz';

interface QuizState {
  userId: number | null;
  quizSet: Quiz[]
}

const initialState: QuizState = {
  userId:null,
  quizSet: []
};

const projectsReducer = produce(
  (state: QuizState = initialState, action: Action): QuizState => {
    switch (action.type) {
      case ActionType.SET_QUIZ:
      state.userId = action.payload.userId;
      state.quizSet = action.payload.quizSet;
        return state;
      default:
        return state;
    }
  },
);

export default projectsReducer;
