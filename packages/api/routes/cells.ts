import express from 'express';
import { verify } from './verifyToken';

const router = express.Router();

router.post('/', verify, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
