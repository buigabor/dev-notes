import camelcaseKeys from 'camelcase-keys';
require('dotenv').config();

const postgres = require('postgres');
const sql = postgres();

interface Cell {
  id: number;
  content: string;
  projectId: number;
  cellType: string;
}
interface Project {
  id: number;
  userId: number;
  title: string;
  subtitle: string;
  description: string;
}
interface Session {
  id: number;
  token: string;
  expiryTimestamp: Date;
  userId: number;
}

interface UserInDB {
  username: string;
  password: string;
  email: string;
}

// USERS

export async function getUserById(id: number) {
  const currentUser = await sql`SELECT * from users WHERE id=${id}`;
  return currentUser.map((c: UserInDB) => camelcaseKeys(c))[0];
}

export async function getUserByName(username: string) {
  const currentUser = await sql`SELECT * from users WHERE username=${username}`;
  return currentUser.map((c: UserInDB) => camelcaseKeys(c))[0];
}

export async function getUserByEmail(email: string) {
  const currentUser = await sql`SELECT * from users WHERE email=${email}`;
  return currentUser.map((c: UserInDB) => camelcaseKeys(c))[0];
}

export async function saveUser({ username, password, email }: UserInDB) {
  await sql`INSERT INTO users (username, password, email) VALUES(${username},${password}, ${email})`;
}

// SESSIONS TABLE

export async function getSessionByToken(token: string) {
  const sessions = await sql`
    SELECT * FROM sessions WHERE token = ${token};
  `;

  return sessions.map((s: Session) => camelcaseKeys(s))[0];
}

export async function insertSession(token: string, userId: number) {
  await sql`
    INSERT INTO sessions
      (token, user_id)
    VALUES
      (${token}, ${userId})
    RETURNING *;
  `;
}

export async function deleteExpiredSessions() {
  await sql`
    DELETE FROM sessions WHERE expiry_timestamp < NOW();
  `;
}

export async function deleteSessionByToken(token: string | undefined) {
  await sql`
    DELETE FROM sessions WHERE token = ${token};
  `;
}

// PROJECTS TABLE

export async function insertProject(
  userId: number,
  title: string,
  subtitle: string,
  description: string,
) {
  const project = await sql`
    INSERT INTO projects
      (user_id, title, subtitle, description)
    VALUES
      (${userId}, ${title}, ${subtitle}, ${description})
    RETURNING *;
  `;

  return project.map((p: Project) => camelcaseKeys(p))[0];
}

export async function updateProject(
  userId: number,
  title: string,
  subtitle: string,
  description: string,
  projectId: string,
) {
  await sql`
    INSERT INTO projects
      (user_id)
    VALUES
      (${userId})
    ON CONFLICT (name) DO UPDATE SET name=${title} WHERE user_id=${userId}
    RETURNING *;
  `;
}

// CELLS

export async function saveCellData(
  projectId: number,
  data: string,
  order: string,
) {
  const cell = await sql`
    INSERT INTO cellsData
      (project_id, data, orderOfCells)
    VALUES
      (${projectId}, ${data},${order})
    RETURNING *;
  `;

  return cell.map((c: Cell) => camelcaseKeys(c))[0];
}
