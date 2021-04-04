/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';

const quizOverlayStyles = css`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  transition: all 0.2s linear;
  background: rgba(26, 26, 26, 0.7);
  z-index: 2;
  visibility: 'visible';
  display: flex;
  justify-content: center;
  align-items: center;

  .create-quiz-wrapper {
    position: relative;
    background-color: #fff;
    width: 40vw;
    padding: 2rem 4rem;
    border-radius: 10px;
    transition: all 0.25s ease-in-out;
    display: flex;
    align-items: center;
    flex-direction: column;
    .fa-times {
      cursor: pointer;
      font-size: 1.5em;
      position: absolute;
      top: 25px;
      right: 30px;
    }
  }

  .quiz-details {
    width: 100%;
  }

  .quiz-container {
    display: flex;
    flex-direction: column;
  }

  .quiz-answer {
    &-row {
      display: flex;
      gap: 25px;
      margin-bottom: 15px;
    }
    &-box{
      display:flex;
      justify-content: space-between;
      width: 100%;
    }
  }

  .quiz-question {
    width: 100%;
    margin-bottom: 15px;
  }

  .quiz-number {
    margin: 20px 0;
  }

  .add-question-btn {
    display: flex;
    justify-content: center;
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },

    textField: {
      width: '100%',
    },

    addQuestionBtn: {
      color: '#00b5ad',
    },
  }),
);

interface CreateQuizProps {
  setShowCreateQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateQuiz: boolean;
}

export const CreateQuiz: React.FC<CreateQuizProps> = (
 { setShowCreateQuiz,
  showCreateQuiz,}
) => {
const classes = useStyles();
const [questions, setQuestions] = useState([{index:1, question:'', correctAnswer:'', incorrectAnswers:[]}])
const [quizTitle, setQuizTitle] = useState('');

const handleOnChange = ()=>{

}
  return (
    <div
      style={{ visibility: showCreateQuiz ? 'visible' : 'hidden' }}
      css={quizOverlayStyles}
      className="overlay"
      onClick={(e) => {
        if ((e.target as HTMLDivElement).classList.contains('overlay')) {
          setShowCreateQuiz(false);
        }
      }}
    >
      <div
        style={{
          transform: showCreateQuiz ? 'translateY(0)' : 'translateY(-40rem)',
          opacity: showCreateQuiz ? 100 : 0,
        }}
        className="create-quiz-wrapper"
      >
        <i
          onClick={() => {
            setShowCreateQuiz(false);
          }}
          className="fas fa-times"
        ></i>
        <h1>Create A Quiz</h1>
        <div className="quiz-details">
          <TextField
            className={classes.textField}
            id="standard-basic"
            label="Quiz Title"
            onChange={(e)=>{
            setQuizTitle(e.target.value)
            }}
          />
          <div className="quiz-container">
            <span className="quiz-number">Question 1</span>
            <div className="quiz-question">
              <TextField
                className={classes.textField}
                id="outlined-basic"
                label="Question"
                variant="outlined"
              />
            </div>
            <div className="quiz-answer-row">
              <div className="quiz-answer-box">
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Answer 1"
                  variant="outlined"
                />
                <Checkbox
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </div>
              <div className="quiz-answer-box">
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Answer 2"
                  variant="outlined"
                />
                <Checkbox
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </div>
            </div>
            <div className="quiz-answer-row">
              <div className="quiz-answer-box">
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Answer 3"
                  variant="outlined"
                />
                <Checkbox
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </div>
              <div className="quiz-answer-box">
                <TextField
                  className={classes.textField}
                  id="outlined-basic"
                  label="Answer 4"
                  variant="outlined"
                />
                <Checkbox
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </div>
            </div>
          </div>
          <div className="add-question-btn">
            <Button className={classes.addQuestionBtn}>Add Question</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
