import express from 'express';
import { verify } from './verifyToken';

const router = express.Router();

// Get all projects
router.get('/', verify, async (req, res) => {
  try {

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
    console.log(req.body)
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
