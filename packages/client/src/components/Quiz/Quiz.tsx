/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

const quizStyles = css`

`

export const Quiz = () => {
  return (
    <div css={quizStyles}>
      <div className="quiz-wrapper">
        <div className="quiz-question">Question for quiz</div>
        <div className="quiz-answers-wrapper">
          <div className="quiz-answer">Answer 1</div>
          <div className="quiz-answer">Answer 2</div>
          <div className="quiz-answer">Answer 3</div>
          <div className="quiz-answer">Answer 4</div>
        </div>
      </div>
    </div>
  );
}
