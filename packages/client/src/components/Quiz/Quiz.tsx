/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { actionButtonsWrapperStyles } from '../styles/cellListActionButtonStyles';
import { CreateQuiz } from './CreateQuiz';

const quizStyles = css`
  .quiz-wrapper {
    background-color: #fff;
    width: 50vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 3.5rem;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .quiz-question {
    padding: 2.2rem 0;
    margin-bottom: 2rem;

    &-text {
      font-size: 1.3em;
    }
  }

  .quiz-answers {
    &-wrapper {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
  }

  .quiz-answer {
    display: flex;
    gap: 20px;
    &-row {
      display: flex;
      gap: 25px;
    }
    &-box {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: .7rem 1.5rem;
      border-radius: 6px;
      background-color: transparent;
      border: 1.5px solid #06c8bf;
    }
  }
`;

export const Quiz:React.FC = () => {
  const [showCreateQuiz, setShowCreateQuiz] = useState(false)

  return (
    <>
      <CreateQuiz
        showCreateQuiz={showCreateQuiz}
        setShowCreateQuiz={setShowCreateQuiz}
      />
      <div css={quizStyles}>
        <div css={actionButtonsWrapperStyles}>
          <button className="save-btn">
            <i className="fas fa-save"></i>
            <span style={{ fontFamily: 'Architects Daughter' }}>Save</span>
          </button>
          <button onClick={()=>{
            setShowCreateQuiz(true)
          }} className="load-btn">
            <i className="fas fa-folder-plus"></i>{' '}
            <span style={{ fontFamily: 'Architects Daughter' }}>Create</span>

          </button>
        </div>
        {/* ////////////////////////////////////////////////////////////////////////////////////////// */}
        <div className="quiz-wrapper">
          <div className="quiz-question">
            <span className="quiz-question-text">Question for quiz</span>
          </div>
          <div className="quiz-answers-wrapper">
            <div className="quiz-answer-row">
              <div className="quiz-answer-box">Answer 1</div>
              <div className="quiz-answer-box">Answer 2</div>
            </div>
            <div className="quiz-answer-row">
              <div className="quiz-answer-box">Answer 3</div>
              <div className="quiz-answer-box">Answer 4</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
