import express from 'express';
import {
  getAllProjectsByUserId,
  getProjectById,
  insertProject,
  updateProject,
} from '../db';
import { verify } from './verifyToken';

const router = express.Router();

// Get all projects
router.get('/', verify, async (req, res) => {
  try {
    const userId = req.headers.userId;
    const projects = await getAllProjectsByUserId(Number(userId));
    res.status(200).json({ success: true, data: { projects } });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

// Get a single project by project id
router.get('/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;
    const project = await getProjectById(Number(id));

    res.status(200).json({ success: true, data: { project } });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

// Create a project
router.post('/create', verify, async (req, res) => {
  try {
    const { title, subtitle, description } = req.body;
    const userId = Number(req.headers.userId);

    const project = await insertProject(userId, title, subtitle, description);

    res.status(200).json({ success: true, data: { project }, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

// Update a project
router.patch('/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, subtitle, description } = req.body;
    const project = await updateProject(
      Number(id),
      title,
      subtitle,
      description,
    );

    res.status(200).json({ success: true, data: { project }, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

router.delete('/:id', verify, async (req, res) => {
  try {
  } catch (error) {}
});
export default router;
