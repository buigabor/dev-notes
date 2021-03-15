import bcrypt from 'bcrypt';
import cookie from 'cookie';
import express from 'express';
import {
  deleteExpiredSessions,
  getUserByEmail,
  getUserByName,
  insertSession,
  saveUser,
} from '../db';
import { generateToken } from '../utils/session';
import { registerValidation } from './../utils/validation';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check CSRF token validity
    // const secret = process.env.CSRF_TOKEN_SECRET;

    // if (typeof secret === 'undefined') {
    //   res.status(500).send({ success: false });
    //   throw new Error('CSRF_TOKEN_SECRET environment variable not configured!');
    // }

    // const verified = tokens.verify(secret, token);

    // if (!verified) {
    //   return res.status(401).send({ success: false });
    // }

    // Validate data
    const validation = registerValidation({ username, email, password });
    const { error } = validation;
    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }

    // Check if username is already taken
    const usernameAlreadyTaken =
      typeof (await getUserByName(username)) !== 'undefined';

    const emailAlreadyTaken =
      typeof (await getUserByEmail(email)) !== 'undefined';

    if (usernameAlreadyTaken || emailAlreadyTaken) {
      return res
        .status(409)
        .send({ success: false, error: 'Username or email is already taken' });
    }

    // Hash password
    const passwordHashed = await bcrypt.hash(password, 10);

    // Save user to DB
    const user = { username, email, password: passwordHashed };
    await saveUser(user);

    // Create token and send it back in a cookie
    const token = generateToken();
    const currentUser = await getUserByName(username);
    // Save session
    await insertSession(token, currentUser.id);
    // Send cookie back
    const maxAge = 60 * 60 * 72;
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge,
        path: '/',
      }),
    );
    await deleteExpiredSessions();
    return res.status(200).json({ success: true, error: null });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const currentUser = await getUserByName(username);
    const match = await bcrypt.compare(password, currentUser.password);
    if (!match || !currentUser) {
      return res
        .status(401)
        .json({ success: false, error: 'Username or password is incorrect.' });
    }

    const maxAge = 60 * 60 * 72; // 24 hours
    const token = generateToken();
    await insertSession(token, currentUser.id);
    console.log(process.env.NODE_ENV);

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
        path: '/',
      }),
    );
    // res.header('token', token);
    await deleteExpiredSessions();
    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

export default router;
