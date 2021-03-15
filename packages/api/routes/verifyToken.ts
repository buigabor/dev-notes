import cookie from 'cookie';
import express from 'express';
import { deleteExpiredSessions, getSessionByToken, getUserById } from '../db';

export const verify = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const token = cookie.parse(req.headers.cookie || '');
  if (!token.token) {
    res
      .status(401)
      .json({ success: false, error: 'Access Denied. Please login.' });
  }
  try {
    await deleteExpiredSessions();
    const session = await getSessionByToken(token.token);
    if (!session) {
      res.status(408).json({
        success: false,
        error: 'Session expired. Please login again.',
      });
    }
    const user = await getUserById(session.userId);

    req.headers.userId = user.id;
    next();
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid token' });
  }
};
