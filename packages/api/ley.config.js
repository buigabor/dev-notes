// const setPostgresDefaultsOnHeroku = require('./db/index.ts')
// import { setPostgresDefaultsOnHeroku } from './db/index';
import { parse } from 'pg-connection-string';

// setPostgresDefaultsOnHeroku()

function setPostgresDefaultsOnHeroku() {
  if (process.env.DATABASE_URL) {

    // Extract the connection information from the Heroku environment variable
    const { host, database, user, password } = parse(process.env.DATABASE_URL);

    // Set standard environment variables
    process.env.PGHOST = host;
    process.env.PGDATABASE = database;
    process.env.PGUSERNAME = user;
    process.env.PGPASSWORD = password;
  }
};

setPostgresDefaultsOnHeroku()

const options = {};

if (process.env.NODE_ENV === 'production') {
  options.ssl = { rejectUnauthorized: false };
}

module.exports = options;