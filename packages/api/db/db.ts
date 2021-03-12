require('dotenv').config();

const postgres = require('postgres');
const sql = postgres();

export async function getUsers() {
  console.log(await sql`SELECT * from users`);
}
