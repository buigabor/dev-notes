import { Checkbox, createStyles, makeStyles, Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React, { useCallback, useEffect, useState } from 'react';
import { Question } from './CreateQuiz';

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



interface IQuestionContainer {
  questions: Question[];
  question: Question;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

interface AnswersText {
  [key:string]:string
}

interface AnswersBoolean {
  [key: string]: boolean;
}


export const QuestionContainer: React.FC<IQuestionContainer> = ({
  questions,
  question,
  setQuestions,
}) => {
  const [quizQuestion, setQuizQuestion] = useState('');
  const [answers, setAnswers] = useState<AnswersText>({
    answerOne: '',
    answerTwo: '',
    answerThree: '',
    answerFour: '',
  });
  const [correctAnswers, setCorrectAnswers] = useState<AnswersBoolean>({
    answerOne: false,
    answerTwo: false,
    answerThree: false,
    answerFour: false,
  });
  const classes = useStyles();

  const memoizedCallback = useCallback( () => {
    const currentQuestion = questions[question.id];
    const correctAnswersArray = []
    const incorrectAnswersArray = []


    for(let answer in correctAnswers){
      if (correctAnswers[answer]) {
        correctAnswersArray.push(answers[answer])
      } else {
        incorrectAnswersArray.push(answers[answer]);
      }
    }

    currentQuestion.correctAnswers = [...correctAnswersArray];
    currentQuestion.incorrectAnswers = [...incorrectAnswersArray];
    currentQuestion.question = quizQuestion;

    const newQuestionsArray = [...questions]
    newQuestionsArray.splice(question.id, 1, currentQuestion);
    setQuestions([...newQuestionsArray]);
    console.log(newQuestionsArray);
  }, [answers, correctAnswers, question.id, quizQuestion, setQuestions]
  )

  useEffect(() => {
    memoizedCallback();
  }, [answers, correctAnswers, memoizedCallback]);

  const handleOnChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorrectAnswers({ ...correctAnswers, [e.target.name]: e.target.checked });
  };

  const handleOnChangeAnswersTextField = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setAnswers({...answers, [e.target.name]:e.target.value})
  }

  return (
    <div className="quiz-container">
      <span className="quiz-number">Question {question.id + 1}</span>
      <div className="quiz-question">
        <TextField
          className={classes.textField}
          label="Question"
          variant="outlined"
          onChange={(e) => {
            setQuizQuestion(e.target.value);
          }}
        />
      </div>
      <div className="quiz-answer-row">
        <div className="quiz-answer-box">
          <TextField
            className={classes.textField}
            label="Answer 1"
            variant="outlined"
            name="answerOne"
            onChange={handleOnChangeAnswersTextField}
          />
          <Checkbox
            color="primary"
            name="answerOne"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            onChange={handleOnChangeCheckbox}
          />
        </div>
        <div className="quiz-answer-box">
          <TextField
            className={classes.textField}
            label="Answer 2"
            variant="outlined"
            name="answerTwo"
            onChange={handleOnChangeAnswersTextField}
          />
          <Checkbox
            color="primary"
            name="answerTwo"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            onChange={handleOnChangeCheckbox}
          />
        </div>
      </div>
      <div className="quiz-answer-row">
        <div className="quiz-answer-box">
          <TextField
            className={classes.textField}
            label="Answer 3"
            variant="outlined"
            name="answerThree"
            onChange={handleOnChangeAnswersTextField}
          />
          <Checkbox
            color="primary"
            name="answerThree"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            onChange={handleOnChangeCheckbox}
          />
        </div>
        <div className="quiz-answer-box">
          <TextField
            className={classes.textField}
            label="Answer 4"
            variant="outlined"
            name="answerFour"
            onChange={handleOnChangeAnswersTextField}
          />
          <Checkbox
            color="primary"
            name="answerFour"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            onChange={handleOnChangeCheckbox}
          />
        </div>
      </div>
    </div>
  );
};
