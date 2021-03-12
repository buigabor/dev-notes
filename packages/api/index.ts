import express from 'express';
import { getUsers } from './db/db';

const app = express();
const port = 4005;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable CORS
app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  next();
});

app.get('/', async (req, res) => {
  const users = await getUsers();
  console.log(users);

  res.status(200).json({ info: 'Node.js, Express, and Postgres API' });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
