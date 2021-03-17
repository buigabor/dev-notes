import express from 'express';
import { verify } from './verifyToken';

const router = express.Router();

router.get('/', verify, async (req, res) => {
  try {
    res.status(200).json({ success: true, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

export default router;
