import cookie from 'cookie';
import express from 'express';
import { deleteExpiredSessions, getSessionByToken, getUserById } from '../db';

export const verify = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const token = cookie.parse(req.headers.cookie || '');
    console.log(token);

    if (!token.token) {
      return res
        .status(401)
        .json({ success: false, error: 'Access Denied. Please login.' });
    }
    await deleteExpiredSessions();
    const session = await getSessionByToken(token.token);

    if (!session) {
      return res.status(408).json({
        success: false,
        error: 'Session expired. Please login again.',
      });
    }
    const user = await getUserById(session.userId);

    req.headers.userId = user.id;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, error: 'Invalid token' });
  }
};
