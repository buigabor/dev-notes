import camelcaseKeys from 'camelcase-keys';
require('dotenv').config();

const postgres = require('postgres');
const sql = postgres();

interface Cell {
  id: number;
  content: string;
  projectId: number;
  cellTypeId: string;
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

// ROOMS

export async function getUserFromRoom(
  userId: number,
  roomId: string | string[],
) {
  const user = await sql`SELECT * FROM rooms WHERE room_id=${roomId} AND user_id=${userId}`;
  return user.map((u: any) => camelcaseKeys(u))[0];
}

export async function saveUserToRoom(
  userId: number,
  roomId: string | string[],
) {
  const room = await sql`INSERT INTO rooms(user_id,room_id)
  VALUES(${userId},${roomId}) RETURNING *
  `;
}

export async function getUsersFromRoom(roomId: string | string[]) {
  const users = await sql`SELECT * FROM rooms
  JOIN users ON users.id = rooms.user_id WHERE room_id=${roomId}`;
  return users.map((u: any) => camelcaseKeys(u));
}

export async function deleteUserFromRoom(
  userId: number,
  roomId: string | string[],
) {
  const deletedUser = await sql`DELETE FROM rooms WHERE user_id=${userId} AND room_id=${roomId} RETURNING user_id`;
  const user = await getUserById(deletedUser[0].user_id);
  return user;
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
  const currentUser = await sql`INSERT INTO users (username, password, email) VALUES(${username},${password}, ${email}) ON CONFLICT (email) DO UPDATE SET username=${username} RETURNING *`;
  return currentUser.map((c: UserInDB) => camelcaseKeys(c))[0];
}

export async function saveGithubOrGoogleUser(
  username: string,
  userid: number,
  email = 'N/A',
) {
  const currentUser = await sql`INSERT INTO users (id, username, password, email)
   OVERRIDING SYSTEM VALUE
   VALUES (${userid},${username}, ${'N/A'},${email} )
    ON CONFLICT(id) DO UPDATE SET username=${username} RETURNING *;
   `;
  return currentUser.map((c: UserInDB) => camelcaseKeys(c))[0];
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

export async function getProjectById(projectId: number) {
  const project = sql`
  SELECT * from projects WHERE id=${projectId}
  `;

  return project.map((p: Project) => camelcaseKeys(p));
}

export async function getAllProjectsByUserId(userId: number) {
  const projects = await sql`
  SELECT * from projects WHERE user_id=${userId}
  `;

  return projects.map((p: Project) => camelcaseKeys(p));
}

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

export async function updateProjectById(
  projectId: number,
  title: string,
  subtitle: string,
  description: string,
) {
  const project = await sql`
    UPDATE projects
    SET title=${title}, subtitle=${subtitle}, description=${description}
    WHERE id=${projectId}
    RETURNING *
  `;

  return project.map((p: Project) => camelcaseKeys(p))[0];
}

export async function deleteProjectById(projectId: number) {
  const project = await sql`
  DELETE FROM projects WHERE id=${projectId} RETURNING *
  `;

  return project.map((p: Project) => camelcaseKeys(p))[0];
}

// CELLS DATA

export async function getCellDataByProjectId(projectId: number) {
  const project = await sql`
  SELECT * from cellsData WHERE project_id=${projectId}
  `;

  return project.map((p: Project) => camelcaseKeys(p))[0];
}

export async function saveCellData(
  projectId: number,
  data: string,
  order: string,
) {
  const cell = await sql`
  UPDATE cellsData
  SET data=${data}, order_of_cells=${order}
  WHERE project_id=${projectId}
  RETURNING *
  `;

  return cell.map((c: Cell) => camelcaseKeys(c))[0];
}

export async function insertCellData(
  projectId: number,
  data: string,
  order: string,
) {
  const cellsData = await sql`
    INSERT INTO cellsData
      (project_id, data, order_of_cells)
    VALUES
      (${projectId}, ${data},${order})
    RETURNING *;
  `;

  return cellsData.map((c: Cell) => camelcaseKeys(c))[0];
}
