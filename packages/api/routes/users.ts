import cookie from 'cookie';
import express from 'express';
import { getSessionByToken, getUserById } from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  const token = cookie.parse(req.headers.cookie || '');
  try {
    const session = await getSessionByToken(token.token);
    const user = await getUserById(session.userId);
    if (!user) {
      return res.status(200).json({ user: null, error: 'User not found' });
    }
    return res
      .status(200)
      .json({ userId: user.id, username: user.username, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

export default router;
