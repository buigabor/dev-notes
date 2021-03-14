import cookie from 'cookie';
import express from 'express';

export const verify = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const token = cookie.parse(req.headers.cookie || '');

  // console.log(cookie.parse(req.headers['set-cookie']![0]));

  if (token) {
    // await getSessionByToken(token);
  }
  next();
};
