/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { useState } from 'react';
import { useActions } from '../../hooks/useActions';
import { UserState } from '../../state/reducers/userReducer';
import { QuestionContainer } from './QuestionContainer';

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
    &-box {
      display: flex;
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

  .create-quiz-btn {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
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

    createBtn: {
      backgroundColor: '#00b5ad',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#04a39b',
      },
    },
  }),
);

interface CreateQuizProps {
  setShowCreateQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateQuiz: boolean;
  user: UserState;
}

export interface Question {
  id: number;
  question: string;
  correctAnswers: string[] | [];
  incorrectAnswers: string[] | [];
  answers: string[] | [];
}

export const CreateQuiz: React.FC<CreateQuizProps> = ({
  setShowCreateQuiz,
  showCreateQuiz,
  user,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState('');
  const { showAlert, hideAlert } = useActions();
  const classes = useStyles();

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
            onChange={(e) => {
              setQuizTitle(e.target.value);
            }}
          />
          {questions.map((q) => {
            return (
              <QuestionContainer
                key={q.id}
                questions={questions}
                setQuestions={setQuestions}
                question={q}
              />
            );
          })}
          <div className="add-question-btn">
            <Button
              onClick={() => {
                setQuestions([
                  ...questions,
                  {
                    id: questions.length,
                    question: '',
                    correctAnswers: [],
                    incorrectAnswers: [],
                    answers: []
                  },
                ]);
              }}
              className={classes.addQuestionBtn}
            >
              Add Question
            </Button>
          </div>
          <div className="create-quiz-btn">
            <Button
              onClick={async () => {
                try {
                    await axios.post(
                    'http://localhost:4005/quiz/create',
                    { userId: user.userId, quizSet: questions, quizTitle },
                    {
                      withCredentials: true,
                    },
                  );
                  showAlert('Quiz created!', 'success');
                  setTimeout(() => {
                    hideAlert();
                  }, 1000);
                  setShowCreateQuiz(false);
                } catch (error) {
                  showAlert('Quiz creation failed!', 'error');
                  setTimeout(() => {
                    hideAlert();
                  }, 1000);
                  setShowCreateQuiz(false);
                }
              }}
              className={classes.createBtn}
            >
              {' '}
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
