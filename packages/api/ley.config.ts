// const setPostgresDefaultsOnHeroku = require('./db/index.ts')
import { setPostgresDefaultsOnHeroku } from './db/index';

setPostgresDefaultsOnHeroku()

const options:any = {};

if (process.env.NODE_ENV === 'production') {
  options.ssl = { rejectUnauthorized: false };
}

module.exports = options;