import express from 'express';
import { getAllQuizesByUserId, insertQuiz } from '../db';
import { verify } from './verifyToken';

const router = express.Router();

interface QuizStringified {
  id:number;
  quizSet:string;
  quizTitle:string;
  userId:number;
}

// Get all projects
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

// Get a single project by project id
router.get('/:id', verify, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

// Create a project
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

// Update a project
router.patch('/:id', verify, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

router.delete('/:id', verify, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});
export default router;
