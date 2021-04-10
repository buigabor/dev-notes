import express from 'express';
import { createServer } from 'http';
import { Socket } from 'socket.io';
import {
  deleteUserFromRoom,
  getUserFromRoom,
  getUsersFromRoom,
  saveUserToRoom
} from './db';
import authRoute from './routes/auth';
import cellsRoute from './routes/cells';
import projectsRoute from './routes/projects';
import quizRoute from './routes/quiz';
import roomsRoute from './routes/rooms';
import roomserviceRoute from './routes/roomservice';
import sessionsRoute from './routes/sessions';
import usersRoute from './routes/user';

const app = express();
const httpServer = createServer();
const port = process.env.PORT || 4005;
const io = require('socket.io')(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://devnotes-bui.netlify.app'],
  },
});
httpServer.listen(5000);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.header('Origin'));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, DELETE, PATCH',
  );
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

io.on('connection', async (socket: Socket) => {
  const id = socket.handshake.query.id;
  const userId = socket.handshake.query.user;

  if (id && userId) {
    socket.join(id);
    const isUserAlreadyThere = await getUserFromRoom(Number(userId), id);
    if (!isUserAlreadyThere) {
      await saveUserToRoom(Number(userId), id);
    }
    const usersInRoom = await getUsersFromRoom(id);

    let usernamesInRoom = usersInRoom.map((user: any) => user.username);
    io.to(id).emit('users-in-room', usernamesInRoom);

    socket.on('send-message', ({ text, sender, date }) => {
      socket.broadcast.to(id).emit('receive-message', { text, sender, date });
      socket.emit('receive-message-me', { text, sender, date });
    });
  }
  socket.on('disconnect', async () => {
    console.log('disconnected');
    if (id) {
      const deletedUser = await deleteUserFromRoom(Number(userId), id);
      io.to(id).emit('user-disconnected', deletedUser.username);
    }
  });
});
// app.options('*', cors());

// Route middleware
app.use('/rooms', roomsRoute);
app.use('/user', usersRoute);
app.use('/auth', authRoute);
app.use('/cells', cellsRoute);
app.use('/projects', projectsRoute);
app.use('/quiz', quizRoute)
app.use('/sessions', sessionsRoute);
app.use('/roomservice', roomserviceRoute);

app.get('/', async (req, res) => {
  res.status(200).json({ info: 'Node.js, Express, and Postgres API' });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
