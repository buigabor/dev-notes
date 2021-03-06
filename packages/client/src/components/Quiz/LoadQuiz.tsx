/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { QuizState } from '../../state/reducers/quizReducer';
import { QuizCard } from './QuizCard';

const quizOverlayStyles = css`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  transition: all 0.2s linear;
  background: rgba(26, 26, 26, 0.7);
  z-index: 100;
  visibility: 'visible';
  display: flex;
  justify-content: center;
  align-items: center;

  .create-quiz-wrapper {
    position: relative;
    background-color: #fff;
    width: 40vw;
    height: 80vh;
    padding: 2rem 4rem;
    border-radius: 10px;
    transition: all 0.25s ease-in-out;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: scroll;
    .fa-times {
      cursor: pointer;
      font-size: 1.5em;
      position: absolute;
      top: 25px;
      right: 30px;
    }
  }

  .quizes-list-wrapper{
    width:100%;
  }
`;

interface LoadQuizProps {
  quizes: QuizState[];
  setQuizes:React.Dispatch<React.SetStateAction<QuizState[]>>;
  setShowLoadQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  showLoadQuiz: boolean;
  resetQuizStates: () => void;
}

export const LoadQuiz: React.FC<LoadQuizProps> = ({
  setShowLoadQuiz,
  setQuizes,
  showLoadQuiz,
  quizes,
  resetQuizStates,
}) => {

  return (
    <div
      style={{ visibility: showLoadQuiz ? 'visible' : 'hidden' }}
      css={quizOverlayStyles}
      className="overlay"
      onClick={(e) => {
        if ((e.target as HTMLDivElement).classList.contains('overlay')) {
          setShowLoadQuiz(false);
        }
      }}
    >
      <div
        style={{
          transform: showLoadQuiz ? 'translateY(0)' : 'translateY(-40rem)',
          opacity: showLoadQuiz ? 100 : 0,
        }}
        className="create-quiz-wrapper"
      >
        <i
          onClick={() => {
            setShowLoadQuiz(false);
          }}
          className="fas fa-times"
        ></i>
        <h1>Load A Quiz</h1>
        <div className="quizes-list-wrapper">
          {quizes
            ? quizes.map((quiz) => {
                return (
                  <QuizCard
                    resetQuizStates={resetQuizStates}
                    setShowLoadQuiz={setShowLoadQuiz}
                    key={quiz.id}
                    quiz={quiz}
                    quizes={quizes}
                    setQuizes={setQuizes}
                  />
                );
              })
            : ''}
        </div>
      </div>
    </div>
  );
};
