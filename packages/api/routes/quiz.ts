import express from 'express';
import { deleteQuizByIdAndUserId, getAllQuizesByUserId, insertQuiz } from '../db';
import { verify } from './verifyToken';

const router = express.Router();

interface QuizStringified {
  id:number;
  quizSet:string;
  quizTitle:string;
  userId:number;
}

// Get all quizes
router.get('/', verify, async (req, res) => {
  try {
    const userId = req.headers.userId;
    const quizes = await getAllQuizesByUserId(Number(userId));

    const quizesParsed = quizes.map((quiz: QuizStringified) => {
      const quizSetParsed = JSON.parse(quiz.quizSet);
      return { ...quiz, quizSet: quizSetParsed };
    });
    console.log(quizesParsed);
    res.status(200).json({ success: true, data: { quizes: quizesParsed } });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

// Create a quiz
router.post('/create', verify, async (req, res) => {
  try {
    const {userId, quizSet, quizTitle} = req.body
    const quizSetString = JSON.stringify(quizSet);
    let quiz = await insertQuiz(userId, quizSetString, quizTitle);
    const quizSetParsed = JSON.parse(quiz.quizSet)
    let quizParsed = { ...quiz, quizSet: quizSetParsed };
    console.log(quizParsed);

    res
      .status(200)
      .json({ success: true, data: { quiz: quizParsed }, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

// Delete a quiz

router.delete('/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.headers.userId;
    if (!userId) {
      return res.status(401).send({ success: true, error: 'Unauthorized' });
    }

    const quiz = await deleteQuizByIdAndUserId(
      Number(id),
      Number(userId),
    );
    res.status(200).json({ success: true, data: { quiz }, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});
export default router;
