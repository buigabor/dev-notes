import express from 'express';
import { insertProject } from '../db';
import { verify } from './verifyToken';

const router = express.Router();

router.post('/create', verify, async (req, res) => {
  console.log(req.body);
  try {
    const { title, subtitle, description } = req.body;
    const userId = Number(req.headers.userId);

    await insertProject(userId, title, subtitle, description);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
