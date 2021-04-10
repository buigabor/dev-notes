/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ProgressBar from "@ramonak/react-progress-bar";
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import baseURL from '../../../server';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { QuizState } from '../../state/reducers/quizReducer';
import { actionButtonsWrapperStyles } from '../styles/cellListActionButtonStyles';
import { Alert } from '../Utils/Alert';
import { CreateQuiz } from './CreateQuiz';
import { LoadQuiz } from './LoadQuiz';

const quizStyles = css`
  padding-bottom: 10rem;
  .progress-bar{
    position:absolute;
    left: 24.75%;
    bottom: 5%;
    z-index: 5;
  }
   .quiz-next-btn {
    background-color: transparent;
    color: #04ada5;
    border: none;
    position: absolute;
    top: 52%;
    right: 3rem;
    font-size: 2.1em;
    opacity: 0.8;
    cursor: pointer;
  }
  .correct-answer {
    color: #48c548;
    padding-bottom: 10px;
  }
  .incorrect-answer {
    color: red;
    padding-bottom: 10px;
  }
  .submit-btn {
    color: #fff;
    border: none;
    font-size: 1.05em;
    border-radius: 4px;
    padding: 6px 24px;
    max-width: 12rem;
    cursor: pointer;
    background-color: #04ada5;
    transition: all 0.25s ease-in;

    &:hover {
      background-color: #05958e;
    }
  }
  .divider-result {
    height: 0.3px;
    background-color: gray;
    width: 50%;
    margin-bottom: 3rem;
    transform: translateY(-20px);
  }
  .divider {
    height: 0.3px;
    background-color: gray;
    width: 50%;
    margin-bottom: 3rem;
  }
  .result {
    &-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    &-title {
      transform: translateY(-50px);
    }
    &-percentage {
      font-size: 1.2em;
      margin-bottom: 0.5rem;
    }
    &-text {
      font-size: 1.2em;
    }
  }

  .quiz-wrapper {
    margin: 0 auto;
    margin-top: -20px;
    background-color: #fff;
    width: 50vw;
    height: 55vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 3.5rem;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    position: relative;
  }

  .quiz-question {
    &__header {
      align-self: flex-start;
      padding: 15px 0 0 15px;
      display: flex;
      width: 95%;
      justify-content: space-between;
      &-number {
      }

      &-score {
      }
    }
    &__title {
      padding-top: 2rem;
      font-size: 1.3em;
    }
    &__text {
      font-size: 1.3em;
    }
  }

  .quiz-answers {
    &-wrapper {
      display: flex;
      flex-direction: column;
      gap: 25px;
      margin-bottom: 2rem;
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
      padding: 0.7rem 1.5rem;
      border-radius: 6px;
      background-color: transparent;
      border: 2px solid #06c8bf;
      height: 2rem;
      width: 6.5rem;
      cursor: pointer;
    }
  }

  .selected {
    background-color: rgb(235, 172, 113, 0.6);
  }
`;

interface SelectedAnswers {
  [key:string]: null | string;
}

export const Quiz:React.FC = () => {
  const [showCreateQuiz, setShowCreateQuiz] = useState(false)
  const [showLoadQuiz, setShowLoadQuiz] = useState(false);
  const [quizes, setQuizes] = useState<QuizState[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [randomOrderForAnswers, setRandomOrderForAnswers] = useState<number[] | []>([]);
  const user = useTypedSelector((state)=>state.user)
  const quiz = useTypedSelector((state)=>state.quiz)


  const answerOneBox = useRef<HTMLDivElement | null>(null)
  const answerTwoBox = useRef<HTMLDivElement | null>(null)
  const answerThreeBox = useRef<HTMLDivElement | null>(null)
  const answerFourBox = useRef<HTMLDivElement | null>(null)
  const [activeAnswers, setActiveAnswers] = useState({
    answerOne: false,
    answerTwo: false,
    answerThree: false,
    answerFour: false,
  });
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({
    answerOne: null,
    answerTwo: null,
    answerThree: null,
    answerFour: null,
  });
  const [isQuestionCorrectlyAnswered, setIsQuestionCorrectlyAnswered] = useState(false)
  const [showResultText, setShowResultText] = useState(false)
  const [isThereMoreQuestionsLeft, setIsThereMoreQuestionsLeft] = useState(true);
  const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);

  const resetQuizStates = ()=>{
    setNumberOfCorrectAnswers(0);
    setCurrentQuestionIndex(0);
    setIsThereMoreQuestionsLeft(true);
    setShowResultText(false);
    setSelectedAnswers({
      answerOne: null,
      answerTwo: null,
      answerThree: null,
      answerFour: null,
    });
    setActiveAnswers({
      answerOne: false,
      answerTwo: false,
      answerThree: false,
      answerFour: false,
    });
  }

  const  calculateProgress = ()=>{
    const progress = (currentQuestionIndex / quiz.quizSet.length) * 100;
    return progress
  }

  const memoizedCheckIfThereIsNoMoreQuestions = useCallback(()=>{
    if (currentQuestionIndex + 1  > quiz.quizSet.length) {
      return setIsThereMoreQuestionsLeft(false);
    }
    return setIsThereMoreQuestionsLeft(true)
  }, [currentQuestionIndex, quiz.quizSet.length])

  const createRandomOrderForAnswers = ()=>{
    const randomOrder = []
    for (let i = 0; i < 4 ; i++) {
      const randomNum = Math.random()
      if(randomNum < 0.5){
        randomOrder.push(i)
      } else {
        randomOrder.unshift(i);
      }
    }
    setRandomOrderForAnswers([...randomOrder]);
  }

  const memoizecheckIfSelectedAnswersAreCorrect = useCallback(()=>{
    if(!quiz.quizSet[currentQuestionIndex]){
      return false
    }
    let isCorrect = false;
    let selectedCorrectAnswersCounter = quiz.quizSet[currentQuestionIndex].correctAnswers.length
    let selectedIncorrectAnswersCounter = 0
    for (const answer in selectedAnswers) {
      if(selectedAnswers[answer]){
        if(quiz.quizSet[currentQuestionIndex].correctAnswers.includes(selectedAnswers[answer] as string)){
          selectedCorrectAnswersCounter = selectedCorrectAnswersCounter - 1;
        }
        if (
          quiz.quizSet[currentQuestionIndex].incorrectAnswers.includes(
            selectedAnswers[answer] as string,
          )
        ) {
          selectedIncorrectAnswersCounter = selectedIncorrectAnswersCounter + 1;
        }
      }
    }
    if (selectedCorrectAnswersCounter === 0  && selectedIncorrectAnswersCounter === 0){
      isCorrect=true
    }
    if (
      selectedCorrectAnswersCounter !==
        0 &&
      selectedIncorrectAnswersCounter !== 0
    ) {
      isCorrect = false;
    }
    return isCorrect;
  }, [currentQuestionIndex, quiz.quizSet, selectedAnswers])

  useEffect(()=>{
    memoizedCheckIfThereIsNoMoreQuestions()
  }, [memoizedCheckIfThereIsNoMoreQuestions, showResultText])

  useEffect(() => {
    if (quiz.quizTitle && isThereMoreQuestionsLeft) {
      const isCorrect = memoizecheckIfSelectedAnswersAreCorrect();
      setIsQuestionCorrectlyAnswered(isCorrect);
    }
  }, [
    memoizecheckIfSelectedAnswersAreCorrect,
    isThereMoreQuestionsLeft,
    quiz.quizTitle,
    selectedAnswers,
  ]);

  // Extract the answers for each answer into an object
  useEffect(() => {
    if (answerOneBox.current && answerTwoBox.current && answerThreeBox.current && answerFourBox.current) {
      setSelectedAnswers({
        answerOne: activeAnswers.answerOne
          ? answerOneBox.current.innerText
          : null,
        answerTwo: activeAnswers.answerTwo
          ? answerTwoBox.current.innerText
          : null,
        answerThree: activeAnswers.answerThree
          ? answerThreeBox.current.innerText
          : null,
        answerFour: activeAnswers.answerFour
          ? answerFourBox.current.innerText
          : null,
      });
    }
  }, [activeAnswers]);

  useEffect(()=>{createRandomOrderForAnswers()}, [])

  return (
    <>
      <Alert />
      <LoadQuiz
        setQuizes={setQuizes}
        resetQuizStates={resetQuizStates}
        quizes={quizes}
        showLoadQuiz={showLoadQuiz}
        setShowLoadQuiz={setShowLoadQuiz}
      />
      <CreateQuiz
        user={user}
        showCreateQuiz={showCreateQuiz}
        setShowCreateQuiz={setShowCreateQuiz}
      />
      <div css={quizStyles}>
        <div css={actionButtonsWrapperStyles}>
          <div className="project-details">
            <h1>Quiz Title:</h1>
            <span className="project-details__title">{quiz.quizTitle}</span>
          </div>
          <button
            onClick={async () => {
              const fetchAllQuizes = async () => {
                const res = await axios.get(`${baseURL}/quiz`, {
                  withCredentials: true,
                });
                const quizes = res.data.data.quizes;

                setQuizes(quizes);
              };
              fetchAllQuizes();
              setShowLoadQuiz(true);
            }}
            className="load-btn"
          >
            <i className="fas fa-file-upload"></i>
            <span style={{ fontFamily: 'Architects Daughter' }}>Load</span>
          </button>
          <button
            onClick={() => {
              setShowCreateQuiz(true);
            }}
            className="load-btn"
          >
            <i className="fas fa-folder-plus"></i>{' '}
            <span style={{ fontFamily: 'Architects Daughter' }}>Create</span>
          </button>
        </div>
        {/* ////////////////////////////////////////////////////////////////////////////////////////// */}
        {quiz.quizTitle ? (
          <>
            <ProgressBar
              className="progress-bar"
              bgColor="#04ada5"
              completed={calculateProgress()}
              width="50vw"
            />
            <div className="quiz-wrapper">
              {isThereMoreQuestionsLeft &&
              quiz.quizSet[currentQuestionIndex] ? (
                <>
                  <div className="quiz-question__header">
                    <span className="quiz-question__header-number">
                      Question {currentQuestionIndex + 1} of{' '}
                      {quiz.quizSet.length}
                    </span>
                    <span className="quiz-question__header-score">
                      Score {numberOfCorrectAnswers} / {quiz.quizSet.length}
                    </span>
                  </div>
                  <div className="quiz-question__title">
                    <span className="quiz-question__text">
                      {quiz.quizSet[currentQuestionIndex].question}
                    </span>
                  </div>
                  <hr className="divider"></hr>
                  <div className="quiz-answers-wrapper">
                    <div className="quiz-answer-row">
                      <div
                        onClick={() => {
                          setActiveAnswers({
                            ...activeAnswers,
                            answerOne: !activeAnswers.answerOne,
                          });
                        }}
                        ref={answerOneBox}
                        className={`quiz-answer-box ${
                          activeAnswers.answerOne ? 'selected' : ''
                        }`}
                      >
                        {
                          quiz.quizSet[currentQuestionIndex].answers[
                            randomOrderForAnswers[0]
                          ]
                        }
                      </div>
                      <div
                        ref={answerTwoBox}
                        onClick={() => {
                          setActiveAnswers({
                            ...activeAnswers,
                            answerTwo: !activeAnswers.answerTwo,
                          });
                        }}
                        className={`quiz-answer-box ${
                          activeAnswers.answerTwo ? 'selected' : ''
                        }`}
                      >
                        {
                          quiz.quizSet[currentQuestionIndex].answers[
                            randomOrderForAnswers[1]
                          ]
                        }
                      </div>
                    </div>
                    <div className="quiz-answer-row">
                      <div
                        ref={answerThreeBox}
                        onClick={() => {
                          setActiveAnswers({
                            ...activeAnswers,
                            answerThree: !activeAnswers.answerThree,
                          });
                        }}
                        className={`quiz-answer-box ${
                          activeAnswers.answerThree ? 'selected' : ''
                        }`}
                      >
                        {
                          quiz.quizSet[currentQuestionIndex].answers[
                            randomOrderForAnswers[2]
                          ]
                        }
                      </div>
                      <div
                        ref={answerFourBox}
                        onClick={() => {
                          setActiveAnswers({
                            ...activeAnswers,
                            answerFour: !activeAnswers.answerFour,
                          });
                        }}
                        className={`quiz-answer-box ${
                          activeAnswers.answerFour ? 'selected' : ''
                        }`}
                      >
                        {
                          quiz.quizSet[currentQuestionIndex].answers[
                            randomOrderForAnswers[3]
                          ]
                        }
                      </div>
                    </div>
                  </div>
                  {isQuestionCorrectlyAnswered && showResultText ? (
                    <span className="correct-answer">Correct!</span>
                  ) : !isQuestionCorrectlyAnswered && showResultText ? (
                    <span className="incorrect-answer">Incorrect!</span>
                  ) : (
                    ''
                  )}
                  <button
                    disabled={showResultText ? true : false}
                    style={{
                      opacity: showResultText ? 0.65 : 1,
                      cursor: showResultText ? 'not-allowed' : 'pointer',
                    }}
                    className="submit-btn"
                    onClick={() => {
                      setShowResultText(true);
                      if (isQuestionCorrectlyAnswered) {
                        setNumberOfCorrectAnswers(
                          (numberOfCorrectAnswers) =>
                            numberOfCorrectAnswers + 1,
                        );
                      }
                    }}
                  >
                    Submit
                  </button>
                  <button
                    style={{
                      visibility: showResultText ? 'visible' : 'hidden',
                      transition: 'all 0.2s ease-in',
                      transitionDelay: '.75s',
                    }}
                    onClick={() => {
                      setShowResultText(false);
                      createRandomOrderForAnswers();
                      setCurrentQuestionIndex(
                        (currentQuestionIndex) => currentQuestionIndex + 1,
                      );

                      setSelectedAnswers({
                        answerOne: null,
                        answerTwo: null,
                        answerThree: null,
                        answerFour: null,
                      });
                      setActiveAnswers({
                        answerOne: false,
                        answerTwo: false,
                        answerThree: false,
                        answerFour: false,
                      });
                    }}
                    className="quiz-next-btn"
                  >
                    <i className="fas fa-arrow-circle-right"></i>
                  </button>{' '}
                </>
              ) : (
                <div className="result-wrapper">
                  <h1 className="result-title">Result</h1>
                  <hr className="divider-result"></hr>
                  <span className="result-percentage">
                    Score:{' '}
                    {(numberOfCorrectAnswers / quiz.quizSet.length) * 100}%
                  </span>
                  <span className="result-text">{`${numberOfCorrectAnswers} out of ${quiz.quizSet.length}`}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
