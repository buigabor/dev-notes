import cookie from 'cookie';
import express from 'express';
import { getSessionByToken, getUserById } from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const token = cookie.parse(req.headers.cookie || '');
    const session = await getSessionByToken(token.token);
    if (!session) {
      return res.status(200).json({ user: null, error: 'Session not found' });
    }
    const user = await getUserById(session.userId);
    if (!user) {
      return res
        .status(200)
        .json({ user: null, error: 'User or session not found' });
    }
    return res
      .status(200)
      .json({ userId: user.id, username: user.username, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, error: 'Invalid token' });
  }
});

router.post('/', async (req, res) => {
  try {
    const usernames = [];
    const userIdsInRoom = req.body;
    console.log(req.body);

    for (const id in userIdsInRoom) {
      const user = await getUserById(Number(id));
      usernames.push(user.username);
    }
    res.status(200).json({ users: usernames, error: null });
  } catch (error) {}
});

export default router;
