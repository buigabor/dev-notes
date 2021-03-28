import express from 'express';
import { getUserById, getUsersFromRoom } from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const room = req.body;
    const users = await getUsersFromRoom(room);
    res.status(200);
  } catch (error) {}
});

router.post('/', async (req, res) => {
  try {
    const usernames = [];
    const userIdsInRoom = req.body;
    for (const id in userIdsInRoom) {
      const user = await getUserById(Number(id));
      usernames.push(user.username);
    }
    res.status(200).json({ users: usernames, error: null });
  } catch (error) {}
});

export default router;
