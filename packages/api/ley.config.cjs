// const setPostgresDefaultsOnHeroku = require('./db/index.ts')
import { setPostgresDefaultsOnHeroku } from './db/index';

setPostgresDefaultsOnHeroku()

const options = {};

if (process.env.NODE_ENV === 'production') {
  options.ssl = { rejectUnauthorized: false };
}

module.exports = options;