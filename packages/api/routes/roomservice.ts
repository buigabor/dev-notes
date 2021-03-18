import axios from 'axios';
import express from 'express';
import { verify } from './verifyToken';

const router = express.Router();

router.post('/', verify, async (req, res) => {
  const body2 = req.body;
  // { room: 'myroom', user: '0.6779191095925778' }

  // Check if this is a valid user
  const userID = req.body.user;
  if (!userID) {
    return res.send(401);
  }
  // Check if this user can access this room
  // if (!isAllowedToAccessRoom(body.room)) {
  //   return res.send(401);
  // }
  const resources = [
    {
      object: 'room',
      reference: body2.room,
      permission: 'join',
    },
  ];
  // const r = await fetch('https://super.roomservice.dev/provision', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer: ${process.env.ROOMSERVICE_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     user: userID,
  //     resources: resources,
  //   }),
  // });

  const r = await axios.post(
    'https://super.roomservice.dev/provision',
    { user: userID, resources },
    {
      headers: {
        Authorization: `Bearer: ${process.env.ROOMSERVICE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  );

  console.log(r.data);
  //   {
  //   object: 'session',
  //   token: 'msZAdJ5ZQ6tULvm5hzbjb',
  //   user_id: 'gst_76a56cd3-5a1c-4008-9cac-0aebf4dc590b',
  //   user: '0.6779191095925778',
  //   resources: [
  //     { object: 'room', id: 'room_70dfa01a-8d7d-4884-b66e-4273a573f8d6' },
  //     { object: 'document', id: '6172c8a0-1790-4090-9b3f-645d028a8c13' }
  //   ]
  // }

  return res.json(r.data);
});

export default router;
