import express from 'express';
import { verify } from './verifyToken';

const router = express.Router();

router.get('/', verify, async (req, res) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
