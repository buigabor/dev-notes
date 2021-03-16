import cors from 'cors';
import express from 'express';
import authRoute from './routes/auth';
import cellsRoute from './routes/cells';
import projectsRoute from './routes/projects';
import sessionsRoute from './routes/sessions';
import usersRoute from './routes/users';

const app = express();
const port = 4005;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Route middleware
app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/cells', cellsRoute);
app.use('/projects', projectsRoute);
app.use('/sessions', sessionsRoute);

// app.use((req, res, next) => {
//   var token = csrfTokens;
//   res.cookie('XSRF-TOKEN', token);
//   res.locals.csrfToken = token;

//   next();
// });

app.get('/', async (req, res) => {
  res.status(200).json({ info: 'Node.js, Express, and Postgres API' });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
