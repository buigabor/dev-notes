import cookie from 'cookie';
import express from 'express';
import { getSessionByToken } from '../db';

export const verify = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const token = cookie.parse(req.headers.cookie || '');
  console.log(token);

  if (!token.token) {
    return res.status(401).json({ success: false, error: 'Access Denied' });
  }
  try {
    const session = await getSessionByToken(token.token);
    if (!session) {
      return res.status(400).json({ success: false, error: 'Session expired' });
    }
    return res.status(200).json({ success: true, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, error: 'Invalid token' });
  }
};
