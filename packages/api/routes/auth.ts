import axios from 'axios';
import bcrypt from 'bcrypt';
import cookie from 'cookie';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import {
  deleteExpiredSessions,
  getUserByEmail,
  getUserByName,
  insertSession,
  saveGithubOrGoogleUser,
  saveUser
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
      return res.status(400).json({ success: false, error: error.message });
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
        path: '/',
      }),
    );
    await deleteExpiredSessions();
    return res.status(200).json({ success: true, error: null });
  } catch (error) {
    return res.status(400).json(error);
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
    await deleteExpiredSessions();
    return res.status(200).json({ success: true, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

router.get('/logout', async (req, res) => {
  try {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', '', {
        maxAge: -1,
        path: '/',
      }),
    );
    req.headers.userId = '';
    res.status(200).json({ success: true, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

router.get('/github', async (req, res) => {
  try {
    const redirect_uri = 'http://localhost:4005/auth/oauth-callback';
    // `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENTID}`,
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENTID}`,
    );
  } catch (error) {
    console.log(error);
  }
});

router.get('/oauth-callback', async (req, res) => {
  let token = null;
  const body = {
    client_id: process.env.GITHUB_CLIENTID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
  };
  const opts = {
    headers: { accept: 'application/json' },
    withCredentials: true,
  };
  try {
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      body,
      {
        headers: {
          accept: 'application/json',
        },
      },
    );
    token = response.data['access_token'];

    const {
      data: { login, id, name },
    } = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `bearer ${token}` },
    });
    const user = await saveGithubOrGoogleUser(name, id);
    await insertSession(token, id);

    const maxAge = 60 * 60 * 72; // 24 hours
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
    await deleteExpiredSessions();
    res.redirect('http://localhost:3000');
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

router.post('/google', async (req, res) => {
  const token = req.body.token;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);
  const sessionCookie = generateToken();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENTID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    if (payload && payload.name && payload.email) {
      const name = payload.name;
      const email = payload.email;
      const userId = Number(payload.sub.slice(12));
      const user = await saveUser({ username: name, email, password: 'N/A' });
      // const user = await saveGithubOrGoogleUser(name, userId, email);
      await insertSession(sessionCookie, user.id);
    }
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  try {
    await verify();

    const maxAge = 60 * 60 * 72; // 24 hours
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
        path: '/',
      }),
    );
    res.status(200).json({ success: true, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

export default router;
