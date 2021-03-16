import express from 'express';
import { getAllProjectsByUserId, insertProject } from '../db';
import { verify } from './verifyToken';

const router = express.Router();

router.get('/', verify, async (req, res) => {
  try {
    const userId = req.headers.userId;
    const projects = await getAllProjectsByUserId(Number(userId));
    res.status(200).json({ success: true, data: { projects } });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/create', verify, async (req, res) => {
  try {
    const { title, subtitle, description } = req.body;
    const userId = Number(req.headers.userId);

    const project = await insertProject(userId, title, subtitle, description);

    res.status(200).json({ success: true, data: { project } });
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
