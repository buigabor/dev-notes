import express from 'express';
import authRoute from './routes/auth';
import cellsRoute from './routes/cells';
import projectsRoute from './routes/projects';
import roomserviceRoute from './routes/roomservice';
import sessionsRoute from './routes/sessions';
import usersRoute from './routes/user';

const app = express();
const port = 4005;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.header('Origin'));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
// app.use(cors());
// app.use(
//   cors({
//     credentials: true,
//     origin: [
//       'http://localhost:3000',
//       'https://github.com',
//       'http://localhost:4005',
//     ],
//     preflightContinue: true,
//   }),
// );
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.options('*', cors());

// Route middleware
app.use('/user', usersRoute);
app.use('/auth', authRoute);
app.use('/cells', cellsRoute);
app.use('/projects', projectsRoute);
app.use('/sessions', sessionsRoute);
app.use('/roomservice', roomserviceRoute);

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
